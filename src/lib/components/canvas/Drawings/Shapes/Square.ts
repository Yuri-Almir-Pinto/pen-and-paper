import type { BaseCommand } from "../../Commands/BaseCommand";
import { BaseDrawing } from "../BaseDrawing";
import { SvgSquare } from "../SvgTools/SvgSquare";

export class Square extends BaseDrawing<SvgSquare> {
    private _originX: number
    private _originY: number
    private _width: number
    private _height: number
    private _borderRadius: number

    constructor() {
        super(new SvgSquare());

        this._originX = 0;
        this._originY = 0;
        this._width = 0;
        this._height = 0;
        this._borderRadius = 0;
    }

    execute(commands: BaseCommand[]) {
        super.execute(commands);

        throw new Error("Method not implemented.");
    }

    protected setOrigin(newOriginX: number, newOriginY: number) {
        this._originX = newOriginX;
        this._originY = newOriginY;
        this.svg.origin(newOriginX, newOriginY);
    }

    protected setSize(newWidth: number, newHeight: number) {
        this._width = newWidth;
        this._height = newHeight;
        this.svg.size(this._width, this._height, this._originX, this._originY);
    }

    protected setBorderRadius(newBorderRadius: number) {
        this._borderRadius = newBorderRadius;
        this.svg.borderRadius(this._borderRadius);
    }
}