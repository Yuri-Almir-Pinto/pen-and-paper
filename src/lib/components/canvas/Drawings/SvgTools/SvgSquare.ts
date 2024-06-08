import { BaseSvg } from "./BaseSvg";
import type { IsShape, SvgType } from "./Types";


export class SvgSquare extends BaseSvg implements IsShape  {
    constructor() {
        super("rect");
    }

    origin(x: number, y: number): this {
        this.svg.setAttribute("x", x.toString());
        this.svg.setAttribute("y", y.toString());
        return this;
    }
    size(width: number, height: number, x: number, y: number): this {
        this.svg.setAttribute("width", Math.abs(width === 0 ? 1 : width).toString());
        this.svg.setAttribute("height", Math.abs(height === 0 ? 1 : height).toString());
        x = width > 0 ? x : x + width;
        y = height > 0 ? y : y + width;
        
        this.svg.setAttribute("x", x.toString());
        this.svg.setAttribute("y", y.toString());
        return this;
    }
    borderRadius(radius: number): this {
        this.svg.setAttribute("rx", Math.abs(radius).toString());
        this.svg.setAttribute("ry", Math.abs(radius).toString());
        return this;
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        return type === "square"
    }
}