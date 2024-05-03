import * as PIXI from "pixi.js";
import * as ACTION from "./Action";
import * as COLLECTION from "./ActionCollection";
import * as TYPES from "../definitions";
import { assertUnreachable }from "../utils/general"
import { mouseEventsHandler } from "../utils/mouseEventsHandler";

export class CanvasHandler implements TYPES.IMouseEvents {
    private _app: PIXI.Application<PIXI.Renderer>
    private _actions: COLLECTION.ActionCollection
    private _currentDrawing?: ACTION.Action

    currentMode: TYPES.InteractionType = TYPES.InteractionType.DrawLine
    currentColor: number = 0x000000
    currentWidth: number = 4

    constructor(app: PIXI.Application<PIXI.Renderer>) {
        this._app = app;
        this._actions = new COLLECTION.ActionCollection(this._app);

        const customClickEventsHandler = new mouseEventsHandler(this, this._app.canvas)
    }

    mouseDownHandler(event: MouseEvent, element: HTMLElement) {
        switch(this.currentMode) {
            case TYPES.InteractionType.DrawLine:
                this._startDrawing(TYPES.ActionType.Line, element.getLocalCords(event));
                return;
            default:
                assertUnreachable(this.currentMode);
        }
    }

    mouseUpHandler(event: MouseEvent, element: HTMLElement) {
        switch(this.currentMode) {
            case TYPES.InteractionType.DrawLine:
                this._stopDrawing(TYPES.ActionType.Line);
                return;
            default:
                assertUnreachable(this.currentMode);
        } 
    }

    mouseClickHandler(event: MouseEvent, element: HTMLElement) {
        console.log("click")
    }

    mouseDoubleClickHandler(event: MouseEvent, element: HTMLElement) {
        console.log("double");
    }

    mouseMoveHandler(event: MouseEvent, element: HTMLElement) {
        if (this._currentDrawing == undefined)
            return;

        switch(this.currentMode) {
            case TYPES.InteractionType.DrawLine:
                this._progressDrawing(TYPES.ActionType.Line, element.getLocalCords(event));
                return;
            default:
                assertUnreachable(this.currentMode);
        }
    }

    private _startDrawing(type: TYPES.ActionType, origin: TYPES.Coords) {
        switch(type) {
            case TYPES.ActionType.Line:
                this._drawing = new ACTION.Action({
                    actionType: type,
                    color: this.currentColor,
                    origin: origin,
                    path: [origin],
                    width: this.currentWidth
                });
                return;
            default:
                assertUnreachable(type);
        }
    }

    private _progressDrawing(type: TYPES.ActionType, mouseCoords: TYPES.Coords) {
        if (this._currentDrawing == null) { 
            console.error("_currentDrawing was null when progressing."); 
            return; 
        }

        switch(type) {
            case TYPES.ActionType.Line:
                this._drawing = new ACTION.Action({
                    actionType: type,
                    color: this.currentColor,
                    origin: this._currentDrawing.origin,
                    path: [mouseCoords],
                    width: this.currentWidth
                });
                return;
            default:
                assertUnreachable(type);
        }
    }

    private _stopDrawing(type: TYPES.ActionType) {
        if (this._currentDrawing == null) { 
            console.error("_currentDrawing was null when stopping."); 
            return; 
        }

        switch(type) {
            case TYPES.ActionType.Line:
                const drawing = this._currentDrawing;
                this._app.stage.removeChild(this._currentDrawing.graphics!);
                this._currentDrawing = undefined;
                this._actions.addAction(drawing);

                console.log(this._actions);
                return;
            default:
                assertUnreachable(type);
        }
    }

    private set _drawing(value: ACTION.Action) {
        if (this._currentDrawing != null && this._currentDrawing.graphics != null)
            this._app.stage.removeChild(this._currentDrawing.graphics)

        value.activate();
        this._app.stage.addChild(value.graphics!);
        this._currentDrawing = value;
    }

}