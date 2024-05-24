export default class CanvasStateDTO {
    currentMode: InteractionType
    fillColor: number | string
    strokeColor: number | string
    strokeWidth: number
    roundedCorners: number
    zoom: number

    constructor(currentMode: InteractionType, 
        fillColor: number | string, 
        strokeColor: number | string, 
        strokeWidth: number, 
        roundedCorners: number,
        zoom: number) {

        this.currentMode = currentMode;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.roundedCorners = roundedCorners;
        this.zoom = zoom;
    }

    commit(): Readonly<CanvasStateDTO> {
        return Object.freeze(this);
    }
}