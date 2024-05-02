import * as PIXI from "pixi.js";

export enum ActionType {
    Line,
};

export type Coords = [number, number];

export class Action {
    actionType: ActionType;
    path: Coords[]
    origin: Coords
    width: number
    color: number

    constructor(width: number, color: number, origin: Coords, path: Coords[], type: ActionType) {
        this.path = path;
        this.origin = origin;
        this.actionType = type;
        this.width = width;
        this.color = color;
    }

    draw(graphics: PIXI.Graphics) {
        switch(this.actionType) {
            case ActionType.Line:
                this._drawLine(graphics);
                break;
            default:
                throw new Error("Invalid action type.");
        }
    }

    private _drawLine(graphics: PIXI.Graphics) {
        graphics.moveTo(...this.origin);

        for (let i = 0; i < this.path.length ; i++) {
            graphics.lineTo(...this.path[i]);
        }

        graphics.stroke({ width: this.width, color: this.color });
    }
}