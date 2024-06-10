import type { BaseCommand } from "../Commands/BaseCommand";
import type { NewDrawingCanvasInfo, NewDrawingMouseInfo } from "../Commands/ImplementedCommands/NewDrawing";
import type { Executable } from "../Commands/Types";
import type { BaseSvg } from "./SvgTools/BaseSvg";
import { toColor } from "./Functions";

export class BaseDrawing<TSVG extends BaseSvg> implements Executable {
    svg: TSVG
    private _scaleX: number
    private _scaleY: number
    private _fillColor: string
    private _strokeColor: string
    private _strokeWidth: number

    protected constructor(svg: TSVG) {
        this.svg = svg;
        this._scaleX = 1;
        this._scaleY = 1;
        this._fillColor = "transparent";
        this._strokeColor = "black";
        this._strokeWidth = 2;

        this.svg.scale(this._scaleX, this._scaleY);
        this.svg.fillColor(this._fillColor);
        this.svg.strokeColor(this._strokeColor);
        this.svg.strokeWidth(this._strokeWidth);
    }

    execute(commands: BaseCommand[]): void {
        return
    }

    protected config(canvas: NewDrawingCanvasInfo) {
        this.setFillColor(canvas.fillColor);
        this.setStrokeColor(canvas.strokeColor);
        this.setStrokeWidth(canvas.strokeWidth);
    }

    protected setScale(newScaleX: number, newScaleY: number) {
        this._scaleX = newScaleX;
        this._scaleY = newScaleY;
        this.svg.scale(this._scaleX, this._scaleY);
    }

    protected setFillColor(newFillColor: string | number) {
        this._fillColor = toColor(newFillColor);
        this.svg.fillColor(this._fillColor);
    }

    protected setStrokeColor(newStrokeColor: string | number) {
        this._strokeColor = toColor(newStrokeColor);
        this.svg.strokeColor(this._strokeColor);
    }

    protected setStrokeWidth(newStrokeWidth: number) {
        this._strokeWidth = newStrokeWidth;
        this.svg.strokeWidth(this._strokeWidth);
    }

    protected get scaleX() { return this._scaleX; }
    protected get scaleY() { return this._scaleY; }
    protected get fillColor() { return this._fillColor; }
    protected get strokeColor() { return this._strokeColor; }
    protected get strokeWidth() { return this._strokeWidth; }
}