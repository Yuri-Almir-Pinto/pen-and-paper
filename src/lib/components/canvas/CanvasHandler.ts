import * as PIXI from "pixi.js";
import * as ACTION from "./Action";
import * as COLLECTION from "./ActionCollection";
import * as TYPES from "../definitions";
import { sleep } from "../utils";

export class CanvasHandler {
    private _app: PIXI.Application<PIXI.Renderer>;
    private _actions: COLLECTION.ActionCollection;
    private _isMouseDown: boolean = false;

    constructor(app: PIXI.Application<PIXI.Renderer>) {
        this._app = app;
        this._actions = new COLLECTION.ActionCollection(this._app);

        const handler = this;

        this._app.canvas.addEventListener("mousedown", function(event: MouseEvent) { handler._handleMouseDown(event, this) });
        this._app.canvas.addEventListener("mouseup", function(event: MouseEvent) { handler._handleMouseUp(event, this) });
    }

    private async _handleMouseDown(event: MouseEvent, element: HTMLCanvasElement) {
        this._isMouseDown = true;
        await sleep(100);

        if (!this._isMouseDown)
            return;
    }

    private _handleMouseUp(event: MouseEvent, element: HTMLCanvasElement) {
        this._isMouseDown = false;

        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const action = new ACTION.Action({ width: 3, 
            color: 0x000000, 
            origin: [x, y], 
            path: [[x + 50, y]], 
            actionType: TYPES.ActionType.Line });

        this._actions.addAction(action);
    }
}