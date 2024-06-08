import { BaseSvg } from "./BaseSvg";
import { toPath } from "./Functions";
import type { SvgType, IsShape } from "./Types";

export class SvgPath extends BaseSvg implements IsShape {
    constructor() {
        super("path");
        this.fillColor("transparent");
    }

    path(path: number[]): this {
        this.svg.setAttribute("d", toPath(path));
        return this;
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        return type === "path"
    }
}