import type { CanvasActionDTO } from "../CanvasData/Types"
import CanvasActionData from "../CanvasData/CanvasActionData"
import CanvasStateData from "../CanvasData/CanvasStateData"
import KeyboardData from "../CanvasData/KeyboardData"
import MouseData from "../CanvasData/MouseData"
import { isKeyboardEvent, isMouseEvent, isWheelEvent, setAllEvents } from "../utils/EventFunctions"
import { createCommands } from "./CanvasAction"
import { Command, ResizeMainSVG, ToggleMoveMainSVG } from "../Commands/Command"
import { CommandType, type Executable } from "../Commands/Types"

export default class CanvasHandler implements Executable {
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
        this._setUIViewBox(this._state.viewX, this._state.viewY, this._state.zoom);
        setAllEvents(this._onAction, this._app, this);
    }

    execute(commands: Command[]): void {
        for (let command of commands) {
            switch(true) {
                case command.is(CommandType.ResizeMainSVG):
                    this._setViewBox(command)
                    break;
                case command.is(CommandType.ToggleMoveMainSVG):
                    this._toggleMove(command);
                    break;
            }
        }
    }

    assemble(): CanvasActionDTO {
        return CanvasActionData.new(
            this._mouse.commit(),
            this._keyboard.commit(),
            this._state.commit(),
        )
    }

    private _toggleMove(command: ToggleMoveMainSVG | boolean) {
        if ("boolean" === typeof command)
            this._state.toggleMove(command);
        else
            this._state.toggleMove(command.value)
    }

    private _setViewBox(command: ResizeMainSVG) {
        if (command.definitive === true) {
            this._state.viewX = command.viewX;
            this._state.viewY = command.viewY;
            this._state.zoom = command.zoom;
        }

        this._setUIViewBox(command.viewX, command.viewY, command.zoom);
    }

    private _setUIViewBox(viewX: number, viewY: number, zoom: number) {
        const containerWidth = this._app.parentElement?.clientWidth as number;
        const containerHeight = this._app.parentElement?.clientHeight as number;
        
        this._app.setAttribute("viewBox", `${viewX} ${viewY} ${containerWidth * zoom} ${containerHeight * zoom}`)
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
    
        const commands = createCommands(currentState);
        
        this.execute(commands);
    }

    private _updateInputState() {
        const spaceState = this._keyboard.keysPressed.get(" ");
        const toggle = spaceState === "pressed" ? true : spaceState === "released" ? false : null
        if (toggle != null)
            this._toggleMove(toggle);
    }
 
}