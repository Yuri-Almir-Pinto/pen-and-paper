import CombinedState from "./CombinedState"
import type { MouseDTO, CanvasStateDTO, KeyboardDTO, CanvasActionDTO, CombinedDTO } from "./Types"

export default class CanvasCommandData {
    mouseData: MouseDTO
    keyboardData: KeyboardDTO
    canvasData: CanvasStateDTO
    combinedData: CombinedDTO

    private constructor(mouseData: MouseDTO, keyboardData: KeyboardDTO, canvasData: CanvasStateDTO, combinedData: CombinedDTO) {
        this.mouseData = mouseData;
        this.keyboardData = keyboardData;
        this.canvasData = canvasData;
        this.combinedData = combinedData;
    }

    static new(mouseDTO: MouseDTO, keyboardDTO: KeyboardDTO, canvasDTO: CanvasStateDTO, combinedDTO: CombinedDTO): CanvasActionDTO {
        return Object.freeze(new CanvasCommandData(mouseDTO, keyboardDTO, canvasDTO, combinedDTO));
    }
}