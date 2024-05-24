import type { MouseButtons, ButtonState } from "./Types"

export default class MouseDTO {
    left: ButtonState
    right: ButtonState
    middle: ButtonState
    layerX: number
    layerY: number
    svgX: number
    svgY: number
    altPressed: boolean
    shiftPressed: boolean
    timestamp: number

    constructor(event: MouseEvent, zoom: number, viewX: number, viewY: number, buttons: MouseButtons) {
        this.timestamp = event.timeStamp;
        this.layerX = event.layerX;
        this.layerY = event.layerY;
        this.svgX = ((event.layerX * zoom) + viewX);
        this.svgY = ((event.layerY * zoom) + viewY);
        this.altPressed = event.altKey;
        this.shiftPressed = event.shiftKey;
        this.left = buttons.left;
        this.right = buttons.right;
        this.middle = buttons.middle;
    }

    commit(): Readonly<MouseDTO> {
        return Object.freeze(this);
    }
}