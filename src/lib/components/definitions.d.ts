import type { BaseDrawing } from "./canvas/Drawings/BaseDrawing";
import type { BaseSvg } from "./canvas/Drawings/SvgTools/BaseSvg";

interface PNPObject {
    originDrawing: BaseDrawing<BaseSvg> | undefined
}

declare global {
    interface SVGElement {
        PNP: PNPObject
    }
}
  
