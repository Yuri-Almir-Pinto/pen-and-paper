import { BaseSvg } from "./BaseSvg";
import type { SvgType, IsShape } from "./Types";


export class SvgCircle extends BaseSvg implements IsShape  {
    constructor() {
        super("ellipse");
    }

    origin(cx: number, cy: number): this {
        this.innerSvg.setAttribute("cx", cx.toString());
        this.innerSvg.setAttribute("cy", cy.toString());
        return this;
    }
    size(width: number, height: number, cx: number, cy: number): this {
        width = width/2;
        height = height/2;
        this.innerSvg.setAttribute("rx", Math.abs(width === 0 ? 1 : width).toString());
        this.innerSvg.setAttribute("ry", Math.abs(height === 0 ? 1 : height).toString());
        const xPos = cx + width;
        const yPos = cy + height;
        
        this.innerSvg.setAttribute("cx", xPos.toString());
        this.innerSvg.setAttribute("cy", yPos.toString());
        return this;
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        return type === "circle"
    }
}