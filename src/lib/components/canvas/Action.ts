import * as PIXI from "pixi.js";
import * as TYPES from "../definitions";
import { assertUnreachable } from "../utils";

export class Action {
    private _actionType: TYPES.ActionType;
    private _path: TYPES.Coords[]
    private _origin: TYPES.Coords
    private _width: number
    private _color: number
    graphics?: PIXI.Graphics

    get isActive() {
        return !(this.graphics == null);
    }

    constructor({ width, color, origin, path, actionType }: TYPES.ActionData) {
        this._path = path;
        this._origin = origin;
        this._actionType = actionType;
        this._width = width;
        this._color = color;
    }

    mutate({ width, color, origin, path, actionType }: TYPES.OptionalActionData): PIXI.Graphics {
        if (width != null)
            this._width = width;
        if (color != null)
            this._color = color;
        if (origin != null)
            this._origin = origin;
        if (path != null)
            this._path = path;
        if (actionType != null)
            this._actionType = actionType;

        this.graphics = this._toGraphics();

        return this.graphics;
    }

    activate() {
        this.graphics = this._toGraphics();
    }

    clone() {
        return new Action({
            width: this._width,
            color: this._color,
            origin: this._origin,
            path: this._path,
            actionType: this._actionType
        });
    }

    private _toGraphics(): PIXI.Graphics {
        switch(this._actionType) {
            case TYPES.ActionType.Line:
                return this._drawLine();
            default:
                assertUnreachable(this._actionType);
        }
    }

    private _drawLine() {
        const graphics = new PIXI.Graphics();

        graphics.moveTo(...this._origin);

        for (let i = 0; i < this._path.length ; i++) {
            graphics.lineTo(...this._path[i]);
        }

        graphics.stroke({ width: this._width, color: this._color });

        return graphics;
    }
}