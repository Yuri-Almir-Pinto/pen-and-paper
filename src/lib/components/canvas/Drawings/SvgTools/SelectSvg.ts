import { ns } from "./BaseSvg";
import { SelectSvgProps, type SelectSvgBoxRect } from "./Types";

export class SelectSvg {
    protected svgGroup: SVGGElement
    protected svgSelectBox: SVGRectElement

    constructor(element: Element) {
        this.svgGroup = document.createElementNS(ns, "g");
        this.svgGroup.classList.add(SelectSvgProps.GroupClass)
    
        this.svgSelectBox = createSvgSelectBox();
        this.svgGroup.appendChild(this.svgSelectBox);

        element.appendChild(this.svgGroup);
    
        function createSvgSelectBox() {
            const selectSvg = document.createElementNS(ns, "rect");
            selectSvg.classList.add(SelectSvgProps.SelectBoxClass);
            selectSvg.setAttribute("stroke-width", SelectSvgProps.SelectBoxStrokeWidth);
            selectSvg.setAttribute("fill", SelectSvgProps.SelectBoxFillColor);
            selectSvg.setAttribute("stroke", SelectSvgProps.SelectBoxStrokeColor);
        
            const clientRect = element.getBoundingClientRect();
            applyDOMRect(selectSvg, clientRect);
    
            return selectSvg;
        }
    }

    apply(element: Element) {
        element.appendChild(this.svgGroup);
    }

    remove() {
        this.svgGroup.remove();
    }

    update(clientRect: SelectSvgBoxRect) {
        applyDOMRect(this.svgSelectBox, clientRect);
    }
}

function applyDOMRect(rect: SVGRectElement, domRect: SelectSvgBoxRect) {
    rect.setAttribute("x", (domRect.x - 10).toString());
    rect.setAttribute("y", (domRect.y - 10).toString());
    rect.setAttribute("width", (domRect.width + 20).toString());
    rect.setAttribute("height", (domRect.height + 20).toString());
}





