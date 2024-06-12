import type { BaseDrawing } from "../Drawings/BaseDrawing"
import type { BaseSvg } from "../Drawings/SvgTools/BaseSvg"
import { ButtonState, WheelState, type MouseDTO, updateButtonState, updateWheelState } from "./Types"

interface RelevantMouseData {layerX: number, layerY: number, deltaY?: number, button: number, type: string, target: EventTarget | null }

export default class MouseState implements MouseDTO {
    left: ButtonState
    right: ButtonState
    middle: ButtonState
    wheel: WheelState
    layerX: number
    layerY: number
    svgX: number
    svgY: number
    prevSvgX: number
    prevSvgY: number
    moved: boolean
    isLeftClick: boolean
    target?: Readonly<BaseDrawing<BaseSvg>>

    constructor() {
        this.layerX = 0;
        this.layerY = 0;
        this.svgX = 0;
        this.svgY = 0;
        this.prevSvgX = 0;
        this.prevSvgY = 0;
        this.wheel = WheelState.None
        this.left = ButtonState.None;
        this.right = ButtonState.None;
        this.middle = ButtonState.None;
        this.moved = false;
        this.isLeftClick = false;
        this.target = undefined;
    }

    update(event: RelevantMouseData, zoom: number, viewX: number, viewY: number) {
        this.layerX = event.layerX;
        this.layerY = event.layerY;
        this.svgX = (event.layerX * zoom) + viewX;
        this.svgY = (event.layerY * zoom) + viewY;
        
        if (event.target instanceof SVGElement) {
            let current = event.target;
            while (true) {
                if (current.PNP?.originDrawing != undefined) {
                    this.target = current.PNP.originDrawing;
                    break;
                }
                else {
                    const parent = current.parentElement;

                    if (parent == null || parent.getAttribute("name") === "canvasOriginSvg") {
                        this.target = undefined;
                        break;
                    }
                        

                    if (!(parent instanceof SVGElement)) {
                        this.target = undefined;
                        break;
                    }

                    current = parent;
                }
            }
        }
        else
            this.target = undefined;

        const eucledianDistance = Math.sqrt((this.svgX - this.prevSvgX)^2 + (this.svgY - this.prevSvgY)^2);

        this.isLeftClick = event.type === "mouseup" && eucledianDistance < 5;

        if (event.type === "mousedown") {
            this.prevSvgX = this.svgX;
            this.prevSvgY = this.svgY;
        }

        if (event.deltaY != null)
            this.wheel = event.deltaY < 0 ? WheelState.Up : event.deltaY > 0 ? WheelState.Down : WheelState.None;
        else
            this.wheel = WheelState.None;

        this.moved = event.type === "mousemoved";

        const toSet = event.type === "mousedown" ? ButtonState.Pressed: event.type === "mouseup" ? ButtonState.Released : null;

        if (toSet == null)
            return;

        if (event.button === 0)
            this.left = toSet;
        else if (event.button === 1)
            this.middle = toSet;
        else if (event.button === 2)
            this.right = toSet;
    }

    commit(): MouseDTO {
        return Object.freeze({ ...this });
    }

    updateButtons() {
        this.left = updateButtonState(this.left);
        this.right = updateButtonState(this.right);
        this.middle = updateButtonState(this.middle);
        this.wheel = updateWheelState(this.wheel);
    }
}