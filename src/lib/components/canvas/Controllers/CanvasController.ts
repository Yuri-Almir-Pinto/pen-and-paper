import { ButtonState, type CanvasActionDTO } from "../State/Types"
import CanvasCommandData from "../State/CanvasCommandState"
import CanvasState from "../State/CanvasStateState"
import KeyboardState from "../State/KeyboardState"
import MouseState from "../State/MouseState"
import { isKeyboardEvent, isMouseEvent, isWheelEvent, setAllEvents } from "../utils/EventFunctions"
import { createCommands } from "./ActionController"
import { BaseCommand } from "../Commands/BaseCommand"
import { ToggleMoveMainSVG } from "../Commands/ImplementedCommands/ToggleMoveMainSVG"
import { ResizeMainSVG } from "../Commands/ImplementedCommands/ResizeMainSVG"
import { CommandType, type Executable } from "../Commands/Types"

export default class CanvasController implements Executable {
    private _app: SVGElement
    private _state: CanvasState
    private _keyboard: KeyboardState
    private _mouse: MouseState

    constructor(app: SVGElement) {
        this._app = app;
        this._state = CanvasState.default();
        this._keyboard = new KeyboardState();
        this._mouse = new MouseState();

        this._app.tabIndex = 1;
        this._setUIViewBox(this._state.viewX, this._state.viewY, this._state.zoom);
        setAllEvents(this._onAction, this._app, this);
    }

    execute(commands: BaseCommand[]): void {
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
        return CanvasCommandData.new(
            this._mouse,
            this._keyboard,
            this._state,
        )
    }

    private _toggleMove(command: ToggleMoveMainSVG | boolean) {
        if ("boolean" === typeof command)
            this._state.toggleMove(command);
        else
            this._state.toggleMove(command.value)
    }

    private _setViewBox(command: ResizeMainSVG) {
        if (command.temporary === false) {
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
        this._state.update(this._app);

        this._updateInputState();

        const currentState = this.assemble();
    
        const commands = createCommands(currentState);
        
        this.execute(commands);
    }

    private _updateInputState() {
        const spaceState = this._keyboard.keysPressed.get(" ");
        switch(spaceState) {
            case ButtonState.Pressed:
                this._toggleMove(true)
                break;
            case ButtonState.Released:
                this._toggleMove(false)
                break;
        }
    }
 
}