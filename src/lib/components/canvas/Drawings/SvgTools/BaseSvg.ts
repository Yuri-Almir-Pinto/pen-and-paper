import { toColor } from "./Functions";
import type { IsShape, SvgType } from "./Types";

const ns: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";


export class BaseSvg implements IsShape {
    innerSvg: SVGElement

    protected constructor(svgType: "rect" | "ellipse" | "path" | SVGElement) {
        if (typeof svgType === "string")
            this.innerSvg = document.createElementNS(ns, svgType);
        else
            this.innerSvg = svgType;
    }
    
    scale(scaleX: number, scaleY: number): this {
        this.innerSvg.setAttribute("transform", `scale(${scaleX}, ${scaleY})`);
        return this;
    }
    fillColor(fillColor: string | number): this {
        this.innerSvg.setAttribute("fill", toColor(fillColor));
        return this;
    }
    strokeColor(strokeColor: string | number): this {
        this.innerSvg.setAttribute("stroke", toColor(strokeColor));
        return this;
    }
    strokeWidth(strokeWidth: number): this {
        this.innerSvg.setAttribute("stroke-width", strokeWidth.toString());
        return this;
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        console.error("Some SVG class called the base SVG 'is'. This should not happen.");
        return type === "never"
    }
}





