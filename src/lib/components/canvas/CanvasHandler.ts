import Konva from "konva";
import * as ACTION from "./Action";
import * as COLLECTION from "./ActionCollection";
import { assertUnreachable } from "../utils/general"
import { CanvasEventsHandler } from "./canvasEventsHandler";

export class CanvasHandler implements IMouseEvents {
    private _app: Konva.Stage
    private _actions: COLLECTION.ActionCollection
    private _isClick: boolean = false;
    private _originClickCoords?: Coords

    currentMode: InteractionType = "DrawSquare"
    fillColor: number = 0x00000000
    strokeColor: number = 0xFF5555
    strokeWidth: number = 2
    roundedCorners: number = 10
    transparent: boolean = false

    constructor(app: Konva.Stage) {
        this._app = app;
        const layer = new Konva.Layer();
        this._app.add(layer);
        this._actions = new COLLECTION.ActionCollection(layer);

        new CanvasEventsHandler(this, this._app);
    }

    mouseDownHandler(event: Konva.KonvaEventObject<MouseEvent>) {
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

    mouseUpHandler(event: Konva.KonvaEventObject<MouseEvent>) {
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

    mouseClickHandler(event: Konva.KonvaEventObject<MouseEvent>) {
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

    mouseDoubleClickHandler(event: Konva.KonvaEventObject<MouseEvent>) {
    }

    mouseMoveHandler(event: Konva.KonvaEventObject<MouseEvent>) {
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
        }
    }

    private _startDrawing(type: ActionType, event: Konva.KonvaEventObject<MouseEvent>) {
        if (this._actions.isDrawing)
            return;

        const { evt: { layerX: x, layerY: y } } = event;
        this._originClickCoords = [x, y];

        switch(type) {
            case "Line":
                const line = ACTION.Action.newLine({
                    strokeColor: this.strokeColor,
                    origin: [x, y],
                    path: [x, y],
                    strokeWidth: this.strokeWidth
                });

                this._actions.addCurrentDrawing(line);
                break;
            case "Square":
                const square = ACTION.Action.newSquare({
                    x: x,
                    y: y,
                    width: x - this._originClickCoords[0],
                    height: y - this._originClickCoords[1],
                    fillColor: this.fillColor,
                    strokeColor: this.strokeColor,
                    strokeWidth: this.strokeWidth,
                    cornerRadius: this.roundedCorners,
                    transparent: this.transparent
                });

                this._actions.addCurrentDrawing(square);
                break;
            case "Circle":
                    const circle = ACTION.Action.newCircle({
                        x: x,
                        y: y,
                        width: x - this._originClickCoords[0],
                        height: y - this._originClickCoords[1],
                        fillColor: this.fillColor,
                        strokeColor: this.strokeColor,
                        strokeWidth: this.strokeWidth,
                        transparent: this.transparent
                    });
    
                this._actions.addCurrentDrawing(circle);
                break;
            default:
                assertUnreachable(type);
        }
    }

    private _progressDrawing(type: ActionType, event: Konva.KonvaEventObject<MouseEvent>, { isClick = false } = {}) {
        const { evt: { layerX: x, layerY: y } } = event;

        switch(type) {
            case "Line":
                if (isClick) {
                    this._actions.progressCurrentDrawing((action) => {
                        action.path = [...action.path, x, y];
                    })
                }

                this._actions.progressCurrentDrawing((action) => {
                    action.tempFinalPath = [x, y]
                });

                break;
            case "Square":
                if (this._originClickCoords == undefined) {
                    console.error("originClickCoords undefined when they shouldn't (Drawing square)");
                    return;
                }

                this._actions.progressCurrentDrawing((action) => {
                    action.size({ 
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
                    action.size({ 
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