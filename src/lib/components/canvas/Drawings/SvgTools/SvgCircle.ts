import { BaseSvg } from "./BaseSvg";
import type { SvgType, IsShape } from "./Types";


export class SvgCircle extends BaseSvg implements IsShape  {
    constructor() {
        super("ellipse");
    }

    origin(cx: number, cy: number): this {
        this.svg.setAttribute("cx", cx.toString());
        this.svg.setAttribute("cy", cy.toString());
        return this;
    }
    size(width: number, height: number, cx: number, cy: number): this {
        width = width/2;
        height = height/2;
        this.svg.setAttribute("rx", Math.abs(width === 0 ? 1 : width).toString());
        this.svg.setAttribute("ry", Math.abs(height === 0 ? 1 : height).toString());
        const xPos = width > 0 ? cx + width : (cx + width) - width;
        const yPos = height > 0 ? cy + height : (cy + height) - height;
        
        this.svg.setAttribute("cx", xPos.toString());
        this.svg.setAttribute("cy", yPos.toString());
        return this;
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        return type === "circle"
    }
}