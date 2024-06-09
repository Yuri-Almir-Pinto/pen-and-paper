import { assertUnreachable } from "../../utils/general";
import type { BaseCommand } from "../Commands/BaseCommand";
import type { NewDrawing } from "../Commands/ImplementedCommands/NewDrawing";
import { CommandType, type Executable } from "../Commands/Types";
import type { BaseDrawing } from "./BaseDrawing";
import { Circle } from "./Shapes/Circle";
import { Square } from "./Shapes/Square";
import type { BaseSvg } from "./SvgTools/BaseSvg";
import { DrawingType } from "./Types";

export class DrawingCollection implements Executable {
    private _actions: BaseDrawing<BaseSvg>[]
    private _app: SVGElement
    private _currentlyDrawing?: BaseDrawing<BaseSvg>

    constructor(app: SVGElement) {
        this._actions = [];
        this._app = app;
    }

    execute(commands: BaseCommand[]): void {
        for(let command of commands) {
            switch(true) {
                case command.is(CommandType.NewDrawing):
                    this._addCurrentlyDrawing(this._newDrawing(command));
                    break;
                case command.is(CommandType.ProgressDrawingCreation):
                    if (this.isDrawing === false)
                        break;

                    if (command.temporary === false) {
                        this._currentlyDrawing?.execute([command]);
                        this._commitCurrentlyDrawing();
                    }
                    else
                        this._currentlyDrawing?.execute([command]);
                    break;
            }
        }
    }

    private _newDrawing(command: NewDrawing): BaseDrawing<BaseSvg> {
        switch(command.currentMode) {
            case DrawingType.Square:
                return Square.new(command);
            case DrawingType.Circle:
                return Circle.new(command);
            case DrawingType.Path:
                console.error("Not implemented");
                return null!;
            default:
                console.error("No new drawing was created in the 'newDrawing' method. This is an error.");
                assertUnreachable(command.currentMode);
        }
    }

    private _commitCurrentlyDrawing() {
        if (this.isDrawing === false)
            return;

        this._actions.push(this._currentlyDrawing!);
        this._currentlyDrawing = undefined;
    }

    private _addCurrentlyDrawing(drawing: BaseDrawing<BaseSvg>) {
        if (this.isDrawing === true)
            return;

        this._app.appendChild(drawing.svg.innerSvg);
        this._currentlyDrawing = drawing;
    }

    private _clear() {
        this._actions = [];
        this._app.innerHTML = "";
    }

    get isDrawing() {
        return this._currentlyDrawing != undefined;
    }
}