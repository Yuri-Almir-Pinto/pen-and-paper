import * as DRAWING from "./Drawing";
import * as COLLECTION from "./DrawingCollection";
import { assertUnreachable } from "../utils/general"
import { CanvasEventsHandler } from "./CanvasEventsHandler";

export class CanvasHandler implements IMouseEvents {
    private _app: SVGElement
    private _actions: COLLECTION.ActionCollection
    private _originalCoords?: Coords
    private _currentMouseCoords: Coords = [0, 0]

    private _zoom: number = 1
    private _viewPos: Coords = [0, 0]

    currentMode: InteractionType = "Move"
    fillColor: number | string = "none"
    strokeColor: number | string = 0xFF5555
    strokeWidth: number = 2
    roundedCorners: number = 10

    constructor(app: SVGElement) {
        this._app = app;
        this._actions = new COLLECTION.ActionCollection(this._app);
        new CanvasEventsHandler(this, this._app);

        this._adjustViewBox();
        window.addEventListener("resize", () => this._adjustViewBox());
    }

    mouseDownHandler(event: MouseEvent) {
        this._currentMouseCoords = this._getMouseCoords(event);

        switch(this.currentMode) {
            case "DrawLine":
                this._startAction("DrawLine", event)
                break;
            case "DrawSquare":
                this._startAction("DrawSquare", event);
                break;
            case "DrawCircle":
                this._startAction("DrawCircle", event);
                break;
            case "Move":
                this._startAction("Move", event);
                break;
            default:
                assertUnreachable(this.currentMode);
        }
    }

    mouseUpHandler(event: MouseEvent) {
        switch(this.currentMode) {
            case "DrawLine":
                this._stopAction("DrawLine")
                break;
            case "DrawSquare":
                this._stopAction("DrawSquare");
                break;
            case "DrawCircle":
                this._stopAction("DrawCircle");
                break;
            case "Move":
                this._stopAction("Move");
                break;
            default:
                assertUnreachable(this.currentMode);
        }
    }

    mouseMoveHandler(event: MouseEvent) {
        this._currentMouseCoords = this._getMouseCoords(event);

        switch(this.currentMode) {
            case "DrawLine":
                if (this._actions.isDrawing)
                    this._progressAction("DrawLine", event)
                break;
            case "DrawSquare":
                if (this._actions.isDrawing)
                    this._progressAction("DrawSquare", event);
                break;
            case "DrawCircle":
                if (this._actions.isDrawing)
                    this._progressAction("DrawCircle", event);
                break;
            case "Move":
                if (this._originalCoords == null)
                    break;

                this._progressAction("Move", event);
                break
            default:
                assertUnreachable(this.currentMode);
        }
    }

    mouseClickHandler(event: MouseEvent) {
        switch(this.currentMode) {
            case "DrawLine":
                if (this._actions.isDrawing)
                    this._progressAction("DrawLine", event, { isClick: true })
                break;
            case "DrawSquare":
                this._stopAction("DrawSquare");
                break;
            case "DrawCircle":
                this._stopAction("DrawCircle");
                break;
            case "Move":
                this._stopAction("Move");
                break;
            default:
                assertUnreachable(this.currentMode);
        }
    }

    mouseDoubleClickHandler(event: MouseEvent) {
    }



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
            case "KeyZ":
                /*if (event.ctrlKey) {
                    this._actions.undoAction();
                }*/
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
        }
    }

    private _startAction(type: InteractionType, event: MouseEvent) {
        if (this._actions.isDrawing)
            return;

        const [x, y] = this._currentMouseCoords;
        this._originalCoords = [x, y];

        switch(type) {
            case "DrawLine":
                const line = DRAWING.Drawing.newLine({
                    strokeColor: this.strokeColor,
                    origin: [x, y],
                    path: [x, y],
                    strokeWidth: this.strokeWidth
                });

                this._actions.addCurrentDrawing(line);
                break;
            case "DrawSquare":
                const square = DRAWING.Drawing.newSquare({
                    origin: [x, y],
                    width: x - this._originalCoords[0],
                    height: y - this._originalCoords[1],
                    fillColor: this.fillColor,
                    strokeColor: this.strokeColor,
                    strokeWidth: this.strokeWidth,
                    cornerRadius: this.roundedCorners,
                });

                this._actions.addCurrentDrawing(square);
                break;
            case "DrawCircle":
                    const circle = DRAWING.Drawing.newCircle({
                        origin: [x, y],
                        width: x - this._originalCoords[0],
                        height: y - this._originalCoords[1],
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

    private _progressAction(type: InteractionType, event: MouseEvent, { isClick = false } = {}) {
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
                if (this._originalCoords == undefined) {
                    console.error("originClickCoords undefined when they shouldn't (Drawing square)");
                    return;
                }

                this._actions.progressCurrentDrawing((action) => {
                    action.setSize({ 
                        width: x - this._originalCoords![0],
                        height: y - this._originalCoords![1]
                    });
                });

                break;
            case "DrawCircle":
                if (this._originalCoords == undefined) {
                    console.error("originClickCoords undefined when they shouldn't (Drawing circle)");
                    return;
                }

                this._actions.progressCurrentDrawing((action) => {
                    action.setSize({ 
                        width: x - this._originalCoords![0],
                        height: y - this._originalCoords![1]
                    });
                });
                break;
            case "Move":
                if (this._originalCoords == null)
                    break;

                const [originalX, originalY] = this._originalCoords!;
                const [mouseX, mouseY] = this._currentMouseCoords;
                const [newX, newY] = [Math.floor((originalX - mouseX ) + this._viewPos[0]), Math.floor((originalY - mouseY) + this._viewPos[1])];

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
                if (this._originalCoords == null)
                    break;

                const [originalX, originalY] = this._originalCoords;
                const [mouseX, mouseY] = this._currentMouseCoords;
                const [newX, newY] = [Math.floor((originalX - mouseX ) + this._viewPos[0]), Math.floor((originalY - mouseY) + this._viewPos[1])];

                this._changeViewBox({ newPos: [newX, newY], newZoom: this._zoom });
                break;
            default:
                assertUnreachable(type);
        }

        this._originalCoords = undefined;
    }

    private _adjustViewBox({ viewPos, zoom }: { viewPos: Coords, zoom: number} = { viewPos: this._viewPos, zoom: this._zoom}) {
        const containerWidth = this._app.parentElement?.clientWidth as number;
        const containerHeight = this._app.parentElement?.clientHeight as number;

        this._app.setAttribute("viewBox", `${viewPos[0]} ${viewPos[1]} ${containerWidth * zoom} ${containerHeight * zoom}`)
    }

    private _changeViewBox({ newPos, newZoom }: { newPos?: Coords, newZoom?: number }) {
        if (newPos != null)
            this._viewPos = newPos;
        if (newZoom != null)
            this._zoom = newZoom;

        this._adjustViewBox();
    }

    private _getMouseCoords(event: MouseEvent): Coords {
        const coords = [
            event.layerX / (this._app.clientWidth / this._getViewWidth()) + this._viewPos[0], 
            event.layerY / (this._app.clientHeight / this._getViewHeight()) + this._viewPos[1]
        ];

        return coords as Coords;
    }

    private _getViewWidth() {
        return this._app.parentElement?.clientWidth as number;
    }
    private _getViewHeight() {
        return this._app.parentElement?.clientHeight as number;
    }

}