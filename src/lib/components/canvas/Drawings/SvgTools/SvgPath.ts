import { BaseSvg } from "./BaseSvg";
import { toPath } from "../Functions";
import { type IsShape, SvgType } from "./Types";

export class SvgPath extends BaseSvg implements IsShape {
    type: SvgType = SvgType.Path
    
    constructor() {
        super("path");
        this.fillColor("none");
    }

    path(path: number[]): this {
        this.setAttribute("d", toPath(path));
        return this;
    }
    
}