import { BaseSvg } from "./BaseSvg";
import { type IsShape, SvgType } from "./Types";


export class SvgCircle extends BaseSvg implements IsShape  {
    type: SvgType = SvgType.Circle
    
    constructor() {
        super("ellipse");
    }

    origin(cx: number, cy: number): this {
        this.setAttribute("cx", cx.toString());
        this.setAttribute("cy", cy.toString());
        return this;
    }

    size(width: number, height: number, cx: number, cy: number): this {
        width = width/2;
        height = height/2;
        this.setAttribute("rx", Math.abs(width === 0 ? 1 : width).toString());
        this.setAttribute("ry", Math.abs(height === 0 ? 1 : height).toString());
        const xPos = cx + width;
        const yPos = cy + height;
        
        this.setAttribute("cx", xPos.toString());
        this.setAttribute("cy", yPos.toString());
        return this;
    }
}