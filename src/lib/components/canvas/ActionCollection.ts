import * as PIXI from "pixi.js";
import * as ACTION from "./Action";
import * as TYPES from "../definitions";

export class ActionCollection {
    private _actions: TYPES.SparseArray<ACTION.Action>
    private _app: PIXI.Application;

    constructor(app: PIXI.Application, actions?: ACTION.Action[]) {
        this._actions = actions != null ? actions : [];
        this._app = app;
    }

    addAction(action: ACTION.Action) {
        const clone = action.clone();

        clone.activate();

        this._actions.push(clone);

        this.draw(clone);
    }

    removeAction(action: ACTION.Action) {
        this._actions = this._actions.filter((element) => element !== action);
        this.undraw(action);
    }

    drawAll() {
        for (let i = 0; i < this._actions.length; i++) {
            const action = this._actions[i];
            if (action == null)
                continue;

            this.draw(action);
        }
            
    }

    draw(action: ACTION.Action) {
        if (action.isActive)
            this._app.stage.addChild(action.graphics!);
    }

    undraw(action: ACTION.Action) {
        if (action.isActive)
            this._app.stage.removeChild(action.graphics!);
    }
}