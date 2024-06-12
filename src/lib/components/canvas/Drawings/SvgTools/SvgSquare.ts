import { BaseSvg } from "./BaseSvg";
import { SvgType, type IsShape } from "./Types";


export class SvgSquare extends BaseSvg implements IsShape {
    type: SvgType = SvgType.Square
    
    constructor() {
        super("rect");
    }

    origin(x: number, y: number): this {
        this.setAttribute("x", x.toString());
        this.setAttribute("y", y.toString());
        return this;
    }

    size(width: number, height: number, x: number, y: number): this {
        this.setAttribute("width", Math.abs(width === 0 ? 1 : width).toString());
        this.setAttribute("height", Math.abs(height === 0 ? 1 : height).toString());
        x = width > 0 ? x : x + width;
        y = height > 0 ? y : y + height;
        
        this.setAttribute("x", x.toString());
        this.setAttribute("y", y.toString());
        return this;
    }

    borderRadius(radius: number): this {
        this.setAttribute("rx", Math.abs(radius).toString());
        this.setAttribute("ry", Math.abs(radius).toString());
        return this;
    }
}