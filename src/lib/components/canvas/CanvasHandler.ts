import * as DRAWING from "./Drawing";
import * as COLLECTION from "./DrawingCollection";
import { assertUnreachable } from "../utils/general"
import { CanvasEventsHandler } from "./CanvasEventsHandler";
import "../utils/EventDispatcher";
import EventDispatcher from "../utils/EventDispatcher";

export type DrawingParams = {
    currentMode?: InteractionType
    fillColor?: number | string
    strokeColor?: number | string
    strokeWidth?: number
    roundedCorners?: number
}

export class CanvasHandler implements IEventHandlers {
    private _app: SVGElement
    private _actions: COLLECTION.ActionCollection
    private _originalCoords: { [key: string]: Coords | undefined } = {}
    private _currentMouseCoords: Coords = [0, 0]
    private _previousMode: InteractionType = "Move"
    private _isKeyPressed: { [key: string]: boolean } = {}

    private _zoom: number = 1
    private _viewPos: Coords = [0, 0]

    currentMode: InteractionType = "Move"
    fillColor: number | string = "none"
    strokeColor: number | string = 0xFF5555
    strokeWidth: number = 2
    roundedCorners: number = 10

    paramsChangedEvent: EventDispatcher<DrawingParams> = new EventDispatcher();

    setParams(params: DrawingParams) {
        const { currentMode, fillColor, strokeColor, strokeWidth, roundedCorners } = params;

        if (currentMode !== undefined)
            this.currentMode = currentMode;
        if (fillColor !== undefined)
            this.fillColor = fillColor;
        if (strokeColor !== undefined)
            this.strokeColor = strokeColor;
        if (strokeWidth !== undefined)
            this.strokeWidth = strokeWidth;
        if (roundedCorners !== undefined)
            this.roundedCorners = roundedCorners;

        this.paramsChangedEvent.call({ 
            currentMode: this.currentMode, 
            fillColor: this.fillColor, 
            strokeColor: this.strokeColor, 
            strokeWidth: this.strokeWidth, 
            roundedCorners: this.roundedCorners 
        });
    }


    constructor(app: SVGElement) {
        this._app = app;
        this._actions = new COLLECTION.ActionCollection(this._app);
        new CanvasEventsHandler(this, this._app);

        this._adjustViewBox();
        window.addEventListener("resize", () => this._adjustViewBox());
    }

    // #region mouseHandlers

    mouseDownHandler(event: MouseEvent) {
        this._currentMouseCoords = this._getSvgMouseCoords(event);

        switch(this.currentMode) {
            case "DrawLine": this._startAction("DrawLine"); break;
            case "DrawSquare": this._startAction("DrawSquare"); break;
            case "DrawCircle": this._startAction("DrawCircle"); break;
            case "Move": this._startAction("Move"); break;
            default: assertUnreachable(this.currentMode);
        }
    }

    mouseUpHandler(event: MouseEvent) {
        switch(this.currentMode) {
            case "DrawLine": this._stopAction("DrawLine"); break;
            case "DrawSquare": this._stopAction("DrawSquare"); break;
            case "DrawCircle": this._stopAction("DrawCircle"); break;
            case "Move": this._stopAction("Move"); break;
            default: assertUnreachable(this.currentMode);
        }
    }

    mouseMoveHandler(event: MouseEvent) {
        this._currentMouseCoords = this._getSvgMouseCoords(event);

        switch(this.currentMode) {
            case "DrawLine":
                if (this._actions.isDrawing)
                    this._progressAction("DrawLine")
                break;
            case "DrawSquare":
                if (this._actions.isDrawing)
                    this._progressAction("DrawSquare");
                break;
            case "DrawCircle":
                if (this._actions.isDrawing)
                    this._progressAction("DrawCircle");
                break;
            case "Move":
                if (this._originalCoords[this.currentMode] == null)
                    break;

                this._progressAction("Move");
                break;
            default:
                assertUnreachable(this.currentMode);
        }
    }

    mouseClickHandler(event: MouseEvent) {
        switch(this.currentMode) {
            case "DrawLine":
                if (this._actions.isDrawing)
                    this._progressAction("DrawLine", { isClick: true })
                break;
            case "DrawSquare": this._stopAction("DrawSquare"); break;
            case "DrawCircle": this._stopAction("DrawCircle"); break;
            case "Move": this._stopAction("Move"); break;
            default: assertUnreachable(this.currentMode);
        }
    }

    mouseDoubleClickHandler(event: MouseEvent) {
    }

    wheelHandler(event: WheelEvent) {
        if (event.ctrlKey) {
            const inOrOut = event.deltaY < 0 ? "in" : "out"
            const zoomChange = inOrOut === "in" ? 0.85 : 1.15
            const newZoom = this._zoom * zoomChange;
            const [distanceX, distanceY] = this._getViewPosDistancePercentage(event);
            const [originX, originY] = this._viewPos;
            const [oldWidth, oldHeight] = this._getSVGViewBoxSize();
            const [newWidth, newHeight] = [this._getViewWidth() * newZoom, this._getViewHeight() * newZoom];
            const [diffWidth, diffHeight] = [oldWidth - newWidth, oldHeight - newHeight];

            const newOrigin = [
                originX + (distanceX * diffWidth),
                originY + (distanceY * diffHeight),
            ] as Coords;

                this._changeViewBox({ newPos: newOrigin, newZoom: this._zoom * zoomChange });
            }
    }

    //#endregion

    //#region keyHandlers

    keydownHandler(event: KeyboardEvent) {
        switch(event.code) {
            case "Escape":
                this._stopAction("DrawLine", { includeTempFinalPath: false })
                break;
            case "KeyN":
                if (event.shiftKey && event.ctrlKey) {
                    this._actions.commitCurrentDrawing();
                    this._actions.clear();
                }
                break;
            case "KeyD":
                for (let i = 0; i < 100; i++) {
                    const square = DRAWING.Drawing.newSquare({
                        origin: [Math.random() * 1000, Math.random() * 1000],
                        width: 50,
                        height: 50,
                        fillColor: this.fillColor,
                        strokeColor: "blue",
                        strokeWidth: this.strokeWidth,
                        cornerRadius: this.roundedCorners,
                    });

                    this._actions.addCurrentDrawing(square);
                    this._actions.commitCurrentDrawing();
                }
                break;
            case "KeyR":
                this._changeViewBox({ newPos: [0, 0], newZoom: 1});
                console.clear();
                break;
            case "KeyL":
                console.log(this._currentMouseCoords);
                break;
            case "Space":
                if (this._isKeyPressed[event.code])
                    break;

                this._isKeyPressed[event.code] = true
                this._previousMode = this.currentMode;
                this.setParams({ currentMode: "Move" });
                break;
        }
    }

    keyUpHandler(event: KeyboardEvent) {
        switch(event.code) {
            case "Space":
                this.setParams({ currentMode: this._previousMode });
                this._isKeyPressed[event.code] = false;
                break;
        }
    }

    //#endregion

    //#region actions

    private _startAction(type: InteractionType) {
        const [x, y] = this._currentMouseCoords;
        this._originalCoords[type] = [x, y];

        switch(type) {
            case "DrawLine":
                if (this._actions.isDrawing)
                    break;

                const line = DRAWING.Drawing.newLine({
                    strokeColor: this.strokeColor,
                    origin: [x, y],
                    strokeWidth: this.strokeWidth
                });

                this._actions.addCurrentDrawing(line);
                break;
            case "DrawSquare":
                if (this._actions.isDrawing)
                    break;

                const square = DRAWING.Drawing.newSquare({
                    origin: [x, y],
                    width: x - this._originalCoords[type]![0],
                    height: y - this._originalCoords[type]![1],
                    fillColor: this.fillColor,
                    strokeColor: this.strokeColor,
                    strokeWidth: this.strokeWidth,
                    cornerRadius: this.roundedCorners,
                });

                this._actions.addCurrentDrawing(square);
                break;
            case "DrawCircle":
                if (this._actions.isDrawing)
                    break;

                const circle = DRAWING.Drawing.newCircle({
                    origin: [x, y],
                    width: x - this._originalCoords[type]![0],
                    height: y - this._originalCoords[type]![1],
                    fillColor: this.fillColor,
                    strokeColor: this.strokeColor,
                    strokeWidth: this.strokeWidth,
                });
    
                this._actions.addCurrentDrawing(circle);
                break;
            case "Move":
                break;
            default:
                assertUnreachable(type);
        }
    }

    private _progressAction(type: InteractionType, { isClick = false } = {}) {
        const [x, y] = this._currentMouseCoords;

        switch(type) {
            case "DrawLine":
                if (isClick) {
                    this._actions.progressCurrentDrawing((action) => {
                        action.setPath([...action.getPath(), x, y]);
                    })
                }

                this._actions.progressCurrentDrawing((action) => {
                    action.setTempFinalPath([x, y]);
                });

                break;
            case "DrawSquare":
                if (this._originalCoords[type] == undefined) {
                    console.error("originClickCoords undefined when they shouldn't (Drawing square)");
                    return;
                }

                this._actions.progressCurrentDrawing((action) => {
                    action.setSize({ 
                        width: x - this._originalCoords[type]![0],
                        height: y - this._originalCoords[type]![1]
                    });
                });

                break;
            case "DrawCircle":
                if (this._originalCoords[type] == undefined) {
                    console.error("originClickCoords undefined when they shouldn't (Drawing circle)");
                    return;
                }

                this._actions.progressCurrentDrawing((action) => {
                    action.setSize({ 
                        width: x - this._originalCoords[type]![0],
                        height: y - this._originalCoords[type]![1]
                    });
                });
                break;
            case "Move":
                if (this._originalCoords[type] == null)
                    break;

                const [originalX, originalY] = this._originalCoords[type]!;
                const [mouseX, mouseY] = this._currentMouseCoords;
                const [newX, newY] = [(originalX - mouseX) + this._viewPos[0], (originalY - mouseY) + this._viewPos[1]];

                this._adjustViewBox({ viewPos: [newX, newY], zoom: this._zoom });
                break;
            default:
                assertUnreachable(type);
        }
    }

    private _stopAction(type: InteractionType, { includeTempFinalPath = true } = {}) {
        switch(type) {
            case "DrawLine":
                this._actions.commitCurrentDrawing({ includeTempFinalPath });
                break;
            case "DrawSquare":
                this._actions.commitCurrentDrawing();
                break;
            case "DrawCircle":
                this._actions.commitCurrentDrawing();
                break;
            case "Move":
                if (this._originalCoords[type] == null)
                    break;

                const [originalX, originalY] = this._originalCoords[type]!;
                const [mouseX, mouseY] = this._currentMouseCoords;
                const [newX, newY] = [(originalX - mouseX ) + this._viewPos[0], (originalY - mouseY) + this._viewPos[1]];

                this._changeViewBox({ newPos: [newX, newY] });
                break;
            default:

                assertUnreachable(type);
        }

        this._originalCoords[type] = undefined;
    }

    //#endregion

    private _adjustViewBox({ viewPos, zoom }: { viewPos: Coords, zoom: number} = { viewPos: this._viewPos, zoom: this._zoom}) {
        const containerWidth = this._getViewWidth();
        const containerHeight = this._getViewHeight();
        
        this._app.setAttribute("viewBox", `${viewPos[0]} ${viewPos[1]} ${containerWidth * zoom} ${containerHeight * zoom}`)
    }

    private _changeViewBox({ newPos, newZoom }: { newPos?: Coords, newZoom?: number }) {
        if (newPos != null)
            this._viewPos = newPos;
        if (newZoom != null)
            this._zoom = newZoom;

        this._adjustViewBox();
    }

    private _getSvgMouseCoords(event: MouseEvent): Coords {
        const coords = [
            ((event.layerX * this._zoom) + this._viewPos[0]), 
            ((event.layerY * this._zoom) + this._viewPos[1])
        ];

        return coords as Coords;
    }

    private _getViewPosDistancePercentage(event: MouseEvent): Coords {
        const distanceCenterPercentage = [
            event.layerX / this._getViewWidth(),
            event.layerY / this._getViewHeight()
        ]

        return distanceCenterPercentage as Coords
    }

    private _getViewWidth() {
        return this._app.parentElement?.clientWidth as number;
    }
    private _getViewHeight() {
        return this._app.parentElement?.clientHeight as number;
    }

    private _getSVGViewBoxSize(): Coords {
        const viewBox = this._app.getAttribute("viewBox");

        if (viewBox == null)
            return [0, 0];

        const splitViewBox = viewBox.split(" ");

        return [parseInt(splitViewBox[2]), parseInt(splitViewBox[3])] as Coords;
    }

}