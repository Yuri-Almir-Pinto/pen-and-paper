import type { BaseCommand } from "../Commands/BaseCommand";
import type { Executable } from "../Commands/Types";
import type { BaseDrawing } from "./BaseDrawing";
import type { BaseSvg } from "./SvgTools/BaseSvg";

export class ActionCollection implements Executable {
    private _actions: BaseDrawing<BaseSvg>[]
    private _app: SVGElement
    private _currentlyDrawing?: BaseDrawing<BaseSvg>

    constructor(app: SVGElement) {
        this._actions = [];
        this._app = app;
    }

    execute(commands: BaseCommand[]): void {
        throw new Error("Method not implemented.");
    }

    clear() {
        this._actions = [];
        this._app.innerHTML = "";
    }

    get isDrawing() {
        return this._currentlyDrawing != undefined;
    }
}