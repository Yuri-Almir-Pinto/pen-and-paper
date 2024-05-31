import type { MouseDTO, CanvasStateDTO, KeyboardDTO, CanvasActionDTO } from "./Types"

export default class CanvasActionData {
    mouseData: MouseDTO
    keyboardData: KeyboardDTO
    canvasData: CanvasStateDTO

    private constructor(mouseData: MouseDTO, keyboardData: KeyboardDTO, canvasData: CanvasStateDTO) {
        this.mouseData = mouseData;
        this.keyboardData = keyboardData;
        this.canvasData = canvasData;
    }

    static new(mouseDTO: MouseDTO, keyboardDTO: KeyboardDTO, canvasDTO: CanvasStateDTO): CanvasActionDTO {
        return Object.freeze(new CanvasActionData(mouseDTO, keyboardDTO, canvasDTO));
    }
}