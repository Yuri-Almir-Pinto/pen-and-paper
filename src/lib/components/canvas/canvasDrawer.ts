import * as PIXI from "pixi.js";
import * as Action from "./canvasAction";

export class Drawer {
    private _app: PIXI.Application<PIXI.Renderer>;
    private _actions: Action.Action[];

    constructor(app: PIXI.Application<PIXI.Renderer>) {
        this._app = app;
        this._actions = [
            new Action.Action(2, 0x000000, [50, 50], [[100, 50], [150, 100]], Action.ActionType.Line)
        ];

        this._app.canvas.addEventListener("mousedown", this._handleMouseDown);
        this._app.canvas.addEventListener("mouseup", this._handleMouseUp);
        this._app.canvas.addEventListener("click", this._handleMouseClick);

        const graphics = new PIXI.Graphics();
        this._drawActions(graphics);

        this._app.stage.addChild(graphics);
    }

    private _drawActions(graphics: PIXI.Graphics) {
        for (let i = 0; i < this._actions.length; i++) {
            this._actions[i].draw(graphics);
        }
    }

    private _handleMouseDown(event: MouseEvent) {
        
    }

    private _handleMouseUp(event: MouseEvent) {

    }

    private _handleMouseClick(event: MouseEvent) {

    }
}