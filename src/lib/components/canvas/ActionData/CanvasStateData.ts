import type { CanvasStateDTO } from "./Types"

export default class CanvasStateData implements CanvasStateDTO {
    currentMode: InteractionType
    fillColor: number | string
    strokeColor: number | string
    strokeWidth: number
    roundedCorners: number
    zoom: number
    viewX: number
    viewY: number

    constructor(
        currentMode: InteractionType, 
        fillColor: number | string, 
        strokeColor: number | string, 
        strokeWidth: number, 
        roundedCorners: number,
        zoom: number,
        viewX: number,
        viewY: number) {

        this.currentMode = currentMode;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.roundedCorners = roundedCorners;
        this.zoom = zoom;
        this.viewX = viewX;
        this.viewY = viewY;
    }

    commit(): CanvasStateDTO {
        return Object.freeze({ ...this });
    }

    private _previous?: InteractionType
    toggleMove(value: boolean) {
        if (value === true) {
            this._previous = this.currentMode;
            this.currentMode = "Move"
        }
        else {
            this.currentMode = this._previous!;
            this._previous = undefined;
        }
    }

    isMoveToggled() {
        return this._previous != null;
    }

    static default(): CanvasStateData {
        return new CanvasStateData(
            "Move",
            "transparent",
            "black",
            2,
            10,
            1,
            0,
            0
        )
    }
}

