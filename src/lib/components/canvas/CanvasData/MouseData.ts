import { type MouseButtons, type ButtonState, type WheelState, type MouseDTO, updateButtonState, updateWheelState } from "./Types"

type RelevantMouseData = {timeStamp: number, shiftKey: boolean, altKey: boolean, layerX: number, 
    layerY: number, deltaY?: number, button: number, type: string }

export default class MouseData implements MouseDTO {
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
    altPressed: boolean
    shiftPressed: boolean
    timestamp: number
    moved: boolean

    constructor() {
        this.timestamp = 0;
        this.layerX = 0;
        this.layerY = 0;
        this.svgX = 0;
        this.svgY = 0;
        this.prevSvgX = 0;
        this.prevSvgY = 0;
        this.altPressed = false;
        this.shiftPressed = false;
        this.wheel = "none"
        this.left = "none";
        this.right = "none";
        this.middle = "none";
        this.moved = false;
    }

    update(event: RelevantMouseData, zoom: number, viewX: number, viewY: number) {
        this.timestamp = event.timeStamp;
        this.layerX = event.layerX;
        this.layerY = event.layerY;
        this.svgX = ((event.layerX * zoom) + viewX);
        this.svgY = ((event.layerY * zoom) + viewY);
        this.altPressed = event.altKey;
        this.shiftPressed = event.shiftKey;

        if (event.type === "mousedown") {
            this.prevSvgX = this.svgX;
            this.prevSvgY = this.svgY;
        }

        if (event.deltaY != null)
            this.wheel = event.deltaY < 0 ? "up" : event.deltaY > 0 ? "down" : "none";
        else
            this.wheel = "none";

        this.moved = event.type === "mousemoved";

        const toSet = event.type === "mousedown" ? "pressed" : event.type === "mouseup" ? "released" : null;

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