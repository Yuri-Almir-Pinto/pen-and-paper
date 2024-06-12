import { type SelectSvgBoxRect, type SvgTypeMap } from "./Types";
import type { BaseDrawing } from "../BaseDrawing";
import { toColor } from "../Functions";
import { SvgType, type IsShape } from "./Types";
import { SelectSvg } from "./SelectSvg";

export const ns: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";

export abstract class BaseSvg implements IsShape {
    type: SvgType = SvgType.Base

    protected innerSvg: SVGElement
    protected wrapperSvg: SVGElement

    protected constructor(svgType: "rect" | "ellipse" | "path" | SVGElement) {
        if (typeof svgType === "string")
            this.innerSvg = document.createElementNS(ns, svgType);
        else
            this.innerSvg = svgType;

        this.innerSvg.PNP = {
            originDrawing: undefined
        }

        this.wrapperSvg = document.createElementNS(ns, "g");
        this.wrapperSvg.appendChild(this.innerSvg);
    }

    getOriginDrawing(): BaseDrawing<BaseSvg> {
        return this.innerSvg.PNP?.originDrawing!;
    }

    setOriginDrawing(originDrawing: BaseDrawing<BaseSvg>): void {
        this.innerSvg.PNP.originDrawing = originDrawing;
    }

    scale(scaleX: number, scaleY: number): this {
        this.setAttribute("transform", `scale(${scaleX}, ${scaleY})`);
        return this;
    }

    fillColor(fillColor: string | number): this {
        this.setAttribute("fill", toColor(fillColor));
        return this;
    }

    strokeColor(strokeColor: string | number): this {
        this.setAttribute("stroke", toColor(strokeColor));
        return this;
    }

    strokeWidth(strokeWidth: number): this {
        this.setAttribute("stroke-width", strokeWidth.toString());
        return this;
    }

    appendTo(element: Element) {
        element.appendChild(this.wrapperSvg);
    }

    is<T extends keyof SvgTypeMap>(type: T): this is SvgTypeMap[T] {
        return type === this.type
    }

    protected setAttribute(attribute: string, value: string): void {
        this.innerSvg.setAttribute(attribute, value);
    }
}





