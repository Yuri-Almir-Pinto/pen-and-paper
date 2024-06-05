import type { CanvasActionDTO } from "../CanvasData/Types"
import CanvasActionData from "../CanvasData/CanvasActionData"
import CanvasStateData from "../CanvasData/CanvasStateData"
import KeyboardData from "../CanvasData/KeyboardData"
import MouseData from "../CanvasData/MouseData"
import { isKeyboardEvent, isMouseEvent, isWheelEvent, setAllEvents } from "../utils/EventFunctions"
import { main } from "./CanvasAction"

export default class CanvasHandler {
    private _app: SVGElement
    private _state: CanvasStateData
    private _keyboard: KeyboardData
    private _mouse: MouseData

    constructor(app: SVGElement) {
        this._app = app;
        this._state = CanvasStateData.default();
        this._keyboard = new KeyboardData();
        this._mouse = new MouseData();

        this._app.tabIndex = 1;
        setAllEvents(this._onAction, this._app, this)
        this.setViewBox(this._state.viewX, this._state.viewY, this._state.zoom);
    }

    assemble(): CanvasActionDTO {
        return CanvasActionData.new(
            this._mouse.commit(),
            this._keyboard.commit(),
            this._state.commit(),
        )
    }

    toggleMove(value: boolean) {
        this._state.toggleMove(value);
    }

    setUIViewBox(viewX: number, viewY: number, zoom: number) {
        const containerWidth = this._app.parentElement?.clientWidth as number;
        const containerHeight = this._app.parentElement?.clientHeight as number;
        
        this._app.setAttribute("viewBox", `${viewX} ${viewY} ${containerWidth * zoom} ${containerHeight * zoom}`)
    }

    setViewBox(viewX: number, viewY: number, zoom: number) {
        this._state.viewX = viewX;
        this._state.viewY = viewY;
        this._state.zoom = zoom;

        this.setUIViewBox(viewX, viewY, zoom);
    }

    private _onAction(event: KeyboardEvent | MouseEvent | WheelEvent) {
        this._keyboard.updateButtons();
        this._mouse.updateButtons();

        switch(true) {
            case isKeyboardEvent(event):
                this._keyboard.update(event);
                break;
            case isMouseEvent(event):
            case isWheelEvent(event):
                this._mouse.update(event, this._state.zoom, this._state.viewX, this._state.viewY);
                break;
        }

        this._updateInputState();

        const currentState = this.assemble();
    
        let nextState = main(currentState);

        if (nextState != null)
            nextState(this);
    }

    private _updateInputState() {
        switch(true) {
            case this._keyboard.keysPressed.get(" ") === "pressed":
                this.toggleMove(true);
                break;
            case this._keyboard.keysPressed.get(" ") === "released":
                this.toggleMove(false);
                break;
            default:
                break;
        }
    }
 
}