import * as DRAWING from "./Drawing";
import * as COLLECTION from "./DrawingCollection";
import { assertUnreachable } from "../utils/general"
import { CanvasEventsHandler } from "./canvasEventsHandler";

export class CanvasHandler implements IMouseEvents {
    private _app: SVGElement
    private _actions: COLLECTION.ActionCollection
    private _isClick: boolean = false;
    private _originClickCoords?: Coords

    currentMode: InteractionType = "DrawSquare"
    fillColor: number | string = "none"
    strokeColor: number | string = 0xFF5555
    strokeWidth: number = 2
    roundedCorners: number = 10
    transparent: boolean = false

    constructor(app: SVGElement) {
        this._app = app;
        this._actions = new COLLECTION.ActionCollection(this._app);

        new CanvasEventsHandler(this, this._app);
    }

    mouseDownHandler(event: MouseEvent) {
        switch(this.currentMode) {
            case "DrawLine":
                this._startDrawing("Line", event)
                break;
            case "DrawSquare":
                this._startDrawing("Square", event);
                break;
            case "DrawCircle":
                this._startDrawing("Circle", event);
                break;
            default:
                assertUnreachable(this.currentMode);
        }
    }

    mouseUpHandler(event: MouseEvent) {
        switch(this.currentMode) {
            case "DrawLine":
                this._stopDrawing("Line")
                break;
            case "DrawSquare":
                this._stopDrawing("Square");
                break;
            case "DrawCircle":
                this._stopDrawing("Circle");
                break;
            default:
                assertUnreachable(this.currentMode);
        }
    }

    mouseClickHandler(event: MouseEvent) {
        this._isClick = true;
        switch(this.currentMode) {
            case "DrawLine":
                if (this._actions.isDrawing)
                    this._progressDrawing("Line", event, { isClick: true })
                break;
            case "DrawSquare":
                break;
            case "DrawCircle":
                break;
            default:
                assertUnreachable(this.currentMode);
        }
    }

    mouseDoubleClickHandler(event: MouseEvent) {
    }

    mouseMoveHandler(event: MouseEvent) {
        switch(this.currentMode) {
            case "DrawLine":
                if (this._actions.isDrawing)
                    this._progressDrawing("Line", event)
                break;
            case "DrawSquare":
                if (this._actions.isDrawing)
                    this._progressDrawing("Square", event);
                break;
            case "DrawCircle":
                if (this._actions.isDrawing)
                    this._progressDrawing("Circle", event);
                break;
            default:
                assertUnreachable(this.currentMode);
        }
    }

    keydownHandler(event: KeyboardEvent) {
        switch(event.code) {
            case "Escape":
                this._isClick = false;
                this._stopDrawing("Line", { includeTempFinalPath: false })
                break;
            case "KeyN":
                if (event.shiftKey && event.ctrlKey) {
                    this._isClick = false;
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

    private _startDrawing(type: ActionType, event: MouseEvent) {
        if (this._actions.isDrawing)
            return;

        const { layerX: x, layerY: y } = event;
        this._originClickCoords = [x, y];

        switch(type) {
            case "Line":
                const line = DRAWING.Drawing.newLine({
                    strokeColor: this.strokeColor,
                    origin: [x, y],
                    path: [x, y],
                    strokeWidth: this.strokeWidth
                });

                this._actions.addCurrentDrawing(line);
                break;
            case "Square":
                const square = DRAWING.Drawing.newSquare({
                    origin: [x, y],
                    width: x - this._originClickCoords[0],
                    height: y - this._originClickCoords[1],
                    fillColor: this.fillColor,
                    strokeColor: this.strokeColor,
                    strokeWidth: this.strokeWidth,
                    cornerRadius: this.roundedCorners,
                });

                this._actions.addCurrentDrawing(square);
                break;
            case "Circle":
                    const circle = DRAWING.Drawing.newCircle({
                        origin: [x, y],
                        width: x - this._originClickCoords[0],
                        height: y - this._originClickCoords[1],
                        fillColor: this.fillColor,
                        strokeColor: this.strokeColor,
                        strokeWidth: this.strokeWidth,
                    });
    
                this._actions.addCurrentDrawing(circle);
                break;
            default:
                assertUnreachable(type);
        }
    }

    private _progressDrawing(type: ActionType, event: MouseEvent, { isClick = false } = {}) {
        const { layerX: x, layerY: y } = event;

        switch(type) {
            case "Line":
                if (isClick) {
                    this._actions.progressCurrentDrawing((action) => {
                        action.setPath([...action.getPath(), x, y]);
                    })
                }

                this._actions.progressCurrentDrawing((action) => {
                    action.setTempFinalPath([x, y]);
                });

                break;
            case "Square":
                if (this._originClickCoords == undefined) {
                    console.error("originClickCoords undefined when they shouldn't (Drawing square)");
                    return;
                }

                this._actions.progressCurrentDrawing((action) => {
                    action.setSize({ 
                        width: x - this._originClickCoords![0],
                        height: y - this._originClickCoords![1]
                    });
                });

                break;
            case "Circle":
                if (this._originClickCoords == undefined) {
                    console.error("originClickCoords undefined when they shouldn't (Drawing circle)");
                    return;
                }

                this._actions.progressCurrentDrawing((action) => {
                    action.setSize({ 
                        width: x - this._originClickCoords![0],
                        height: y - this._originClickCoords![1]
                    });
                });
                break;
            default:
                assertUnreachable(type);
        }
    }

    private _stopDrawing(type: ActionType, { includeTempFinalPath = true } = {}) {
        this._originClickCoords = undefined;

        switch(type) {
            case "Line":
                if (!this._isClick) {
                    this._actions.commitCurrentDrawing({ includeTempFinalPath });
                }
                break;
            case "Square":
                this._actions.commitCurrentDrawing();
                break;
            case "Circle":
                this._actions.commitCurrentDrawing();
                break;
            default:
                assertUnreachable(type);
        }
    }

}