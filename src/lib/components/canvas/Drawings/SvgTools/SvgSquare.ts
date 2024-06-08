import { BaseSvg } from "./BaseSvg";
import type { IsShape, SvgType } from "./Types";


export class SvgSquare extends BaseSvg implements IsShape  {
    constructor() {
        super("rect");
    }

    origin(x: number, y: number): this {
        this.innerSvg.setAttribute("x", x.toString());
        this.innerSvg.setAttribute("y", y.toString());
        return this;
    }
    size(width: number, height: number, x: number, y: number): this {
        this.innerSvg.setAttribute("width", Math.abs(width === 0 ? 1 : width).toString());
        this.innerSvg.setAttribute("height", Math.abs(height === 0 ? 1 : height).toString());
        x = width > 0 ? x : x + width;
        y = height > 0 ? y : y + height;
        
        this.innerSvg.setAttribute("x", x.toString());
        this.innerSvg.setAttribute("y", y.toString());
        return this;
    }
    borderRadius(radius: number): this {
        this.innerSvg.setAttribute("rx", Math.abs(radius).toString());
        this.innerSvg.setAttribute("ry", Math.abs(radius).toString());
        return this;
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        return type === "square"
    }
}