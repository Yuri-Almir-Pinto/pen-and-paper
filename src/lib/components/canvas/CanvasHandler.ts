import Konva from "konva";
import * as ACTION from "./Action";
import * as COLLECTION from "./ActionCollection";
import { assertUnreachable } from "../utils/general"
import { CanvasEventsHandler } from "./canvasEventsHandler";

export class CanvasHandler implements IMouseEvents {
    private _app: Konva.Stage
    private _actions: COLLECTION.ActionCollection
    private _isClick: boolean = false;

    currentMode: InteractionType = "DrawLine"
    currentColor: number = 0xFF5555
    currentWidth: number = 4

    constructor(app: Konva.Stage) {
        this._app = app;
        const layer = new Konva.Layer();
        this._app.add(layer);
        this._actions = new COLLECTION.ActionCollection(layer);

        const eventsHandler = new CanvasEventsHandler(this, this._app);
    }

    mouseDownHandler(event: Konva.KonvaEventObject<MouseEvent>) {
        switch(this.currentMode) {
            case "DrawLine":
                this._startDrawing("Line", event)
                return;
            default:
                assertUnreachable(this.currentMode);
        }
    }

    mouseUpHandler(event: Konva.KonvaEventObject<MouseEvent>) {
        switch(this.currentMode) {
            case "DrawLine":
                this._stopDrawing("Line")
                return;
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
                return;
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
                return;
            default:
                assertUnreachable(this.currentMode);
        }
    }

    keydownHandler(event: KeyboardEvent) {
        switch(event.code) {
            case "Escape":
                this._isClick = false;
                this._actions.discardCurrentFinalPath();
                this._stopDrawing("Line")
                return;
            case "KeyN":
                if (event.shiftKey && event.ctrlKey) {
                    this._isClick = false;
                    this._actions.commitCurrentDrawing();
                    this._actions.clear();
                }
                return;
        }
    }

    private _startDrawing(type: ActionType, event: Konva.KonvaEventObject<MouseEvent>) {
        if (this._actions.isDrawing)
            return;

        switch(type) {
            case "Line":
                const { evt: { layerX: x, layerY: y } } = event;
                const action = new ACTION.Action({
                    actionType: type,
                    color: this.currentColor,
                    origin: [x, y],
                    path: [x, y],
                    width: this.currentWidth
                });

                this._actions.addCurrentDrawing(action);
                return;
            default:
                assertUnreachable(type);
        }
    }

    private _progressDrawing(type: ActionType, event: Konva.KonvaEventObject<MouseEvent>, { isClick = false } = {}) {
        switch(type) {
            case "Line":
                const { evt: { layerX: x, layerY: y } } = event;

                if (isClick) {
                    this._actions.progressCurrentDrawing((action) => {
                        action.path = [...action.path, x, y];
                    })
                }

                this._actions.progressCurrentDrawing((action) => {
                    action.tempFinalPath = [x, y]
                })
                return;
            default:
                assertUnreachable(type);
        }
    }

    private _stopDrawing(type: ActionType) {
        switch(type) {
            case "Line":
                if (!this._isClick) {
                    this._actions.commitCurrentDrawing();
                }

                console.log(this._actions);
                return;
            default:
                assertUnreachable(type);
        }
    }

}