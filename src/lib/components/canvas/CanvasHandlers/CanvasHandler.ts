import type { CanvasActionDTO } from "../ActionData/Types"
import CanvasActionData from "../ActionData/CanvasActionData"
import CanvasStateData from "../ActionData/CanvasStateData"
import KeyboardData from "../ActionData/KeyboardData"
import MouseData from "../ActionData/MouseData"
import { isKeyboardEvent, isMouseEvent, isWheelEvent, setAllEvents } from "../utils/EventFunctions"
import { main } from "./CanvasAction"

export default class CanvasHandler {
    app: SVGElement
    state: CanvasStateData
    keyboard: KeyboardData
    mouse: MouseData

    constructor(app: SVGElement) {
        this.app = app;
        this.state = CanvasStateData.default();
        this.keyboard = new KeyboardData();
        this.mouse = new MouseData();

        setAllEvents(this.onAction, this.app)
    }

    assemble(): CanvasActionDTO {
        return CanvasActionData.new(
            this.mouse.commit(),
            this.keyboard.commit(),
            this.state.commit(),
        )
    }

    onAction(event: KeyboardEvent | MouseEvent | WheelEvent) {
        this.keyboard.updateButtons();
        this.mouse.updateButtons();

        switch(true) {
            case isKeyboardEvent(event):
                this.keyboard.update(event);
                break;
            case isMouseEvent(event):
            case isWheelEvent(event):
                this.mouse.update(event, this.state.zoom, this.state.viewX, this.state.viewY);
                break;
        }
        
        main(this.assemble())
    }

}