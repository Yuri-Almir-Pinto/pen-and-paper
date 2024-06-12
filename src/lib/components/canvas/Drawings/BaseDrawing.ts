import type { BaseCommand } from "../Commands/BaseCommand";
import type { NewDrawingCanvasInfo } from "../Commands/ImplementedCommands/NewDrawing";
import type { BaseSvg } from "./SvgTools/BaseSvg";
import { toColor } from "./Functions";
import type { SelectSvgBoxRect } from "./SvgTools/Types";

export abstract class BaseDrawing<TSVG extends BaseSvg> {
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
        this._fillColor = "none";
        this._strokeColor = "black";
        this._strokeWidth = 2;

        this.svg.scale(this._scaleX, this._scaleY);
        this.svg.fillColor(this._fillColor);
        this.svg.strokeColor(this._strokeColor);
        this.svg.strokeWidth(this._strokeWidth);
        this.svg.setOriginDrawing(this);
    }

    execute(commands: BaseCommand[]): void {
        return
    }

    setScale(newScaleX: number, newScaleY: number) {
        this._scaleX = newScaleX;
        this._scaleY = newScaleY;
        this.svg.scale(this._scaleX, this._scaleY);
    }

    setFillColor(newFillColor: string | number) {
        this._fillColor = toColor(newFillColor);
        this.svg.fillColor(this._fillColor);
    }

    setStrokeColor(newStrokeColor: string | number) {
        this._strokeColor = toColor(newStrokeColor);
        this.svg.strokeColor(this._strokeColor);
    }

    setStrokeWidth(newStrokeWidth: number) {
        this._strokeWidth = newStrokeWidth;
        this.svg.strokeWidth(this._strokeWidth);
    }

    protected config(canvas: NewDrawingCanvasInfo) {
        this.setFillColor(canvas.fillColor);
        this.setStrokeColor(canvas.strokeColor);
        this.setStrokeWidth(canvas.strokeWidth);
    }

    protected abstract getBoundingBox(): SelectSvgBoxRect

    protected get scaleX() { return this._scaleX; }
    protected get scaleY() { return this._scaleY; }
    protected get fillColor() { return this._fillColor; }
    protected get strokeColor() { return this._strokeColor; }
    protected get strokeWidth() { return this._strokeWidth; }
}