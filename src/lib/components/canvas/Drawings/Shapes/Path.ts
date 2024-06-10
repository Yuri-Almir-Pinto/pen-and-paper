import type { BaseCommand } from "../../Commands/BaseCommand"
import type { NewDrawingCanvasInfo, NewDrawingMouseInfo } from "../../Commands/ImplementedCommands/NewDrawing"
import { CommandType } from "../../Commands/Types"
import { BaseDrawing } from "../BaseDrawing"
import { SvgPath } from "../SvgTools/SvgPath"


export class Path extends BaseDrawing<SvgPath> {
    private _path!: number[]

    constructor() {
        super(new SvgPath());

        this.setPath([]);
    }

    execute(commands: BaseCommand[]) {
        super.execute(commands);

        for (let command of commands) {
            switch(true) {
                case command.is(CommandType.ProgressDrawing):
                    if (command.temporary === true && command.isLeftClick === false)
                        this.svg.path([...this._path, command.svgX, command.svgY]);
                    else if (command.temporary === false || command.isLeftClick === true)
                        this.setPath([...this._path, command.svgX, command.svgY]);
                    break;
            }
        }
    }

    static new(data: NewDrawingCanvasInfo & NewDrawingMouseInfo): Path {
        const drawing = new Path();
        drawing.config(data);

        drawing.setPath([data.svgX, data.svgY]);

        return drawing;
    }

    protected setPath(newPath: number[]) {
        this._path = newPath;
        this.svg.path(this._path);
    }
}