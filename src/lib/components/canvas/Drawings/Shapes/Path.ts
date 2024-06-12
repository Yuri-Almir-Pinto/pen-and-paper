import type { BaseCommand } from "../../Commands/BaseCommand"
import type { NewDrawingCanvasInfo, NewDrawingMouseInfo } from "../../Commands/ImplementedCommands/NewDrawing"
import { CommandType } from "../../Commands/Types"
import { BaseDrawing } from "../BaseDrawing"
import { SvgPath } from "../SvgTools/SvgPath"
import type { SelectSvgBoxRect } from "../SvgTools/Types"


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
                    this.setPath([...this._path, command.svgX, command.svgY], { 
                        temporary: !(command.temporary === false || command.isLeftClick === true) 
                    });
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

    setPath(newPath: number[], options: { temporary?: boolean } = { temporary: false }) {
        if (options.temporary === false) {
            this._path = newPath;
        }
        
        this.svg.path(newPath);
    }

    protected getBoundingBox(): SelectSvgBoxRect {
        throw new Error("Method not implemented.")
    }
}