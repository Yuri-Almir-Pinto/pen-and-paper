import MouseDTO from "./MouseDTO"
import CanvasStateDTO from "./CanvasStateDTO"
import KeyboardDTO from "./KeyboardDTO"

export class CanvasActionDTO {
    mouseData: Readonly<MouseDTO>
    keyboardData: Readonly<KeyboardDTO>
    canvasData: Readonly<CanvasStateDTO>

    private constructor(mouseData: MouseDTO, keyboardData: KeyboardDTO, canvasData: CanvasStateDTO) {
        this.mouseData = mouseData.commit();
        this.keyboardData = keyboardData.commit();
        this.canvasData = canvasData.commit();
    }

    new(mouseData: MouseDTO, keyboardData: KeyboardDTO, canvasData: CanvasStateDTO) {
        const canvasAction = new CanvasActionDTO(mouseData, keyboardData, canvasData);

        return Object.freeze(canvasAction);
    }
}