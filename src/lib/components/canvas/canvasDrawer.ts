import * as PIXI from "pixi.js";

export class Drawer {
    private _app: PIXI.Application<PIXI.Renderer>;
    private _isClick: boolean;

    constructor(app: PIXI.Application<PIXI.Renderer>) {
        this._isClick = false;
        this._app = app;

        this._app.canvas.addEventListener("mousedown", this.handleMouseDown);
        this._app.canvas.addEventListener("mouseup", this.handleMouseUp);
        this._app.canvas.addEventListener("click", this.handleMouseClick)
    }

    private handleMouseDown(event: MouseEvent) {
        
    }

    private handleMouseUp(event: MouseEvent) {

    }

    private handleMouseClick(event: MouseEvent) {

    }

    async isClick() {

    }
}