import type { BaseCommand } from "../../Commands/BaseCommand"
import type { NewDrawingCanvasInfo, NewDrawingMouseInfo } from "../../Commands/ImplementedCommands/NewDrawing"
import { CommandType } from "../../Commands/Types"
import { BaseDrawing } from "../BaseDrawing"
import { SvgCircle } from "../SvgTools/SvgCircle"


export class Circle extends BaseDrawing<SvgCircle> {
    private _originX!: number
    private _originY!: number
    private _width!: number
    private _height!: number

    constructor() {
        super(new SvgCircle());

        this.setOrigin(0, 0);
        this.setSize(0, 0);
    }

    execute(commands: BaseCommand[]) {
        super.execute(commands);

        for (let command of commands) {
            switch(true) {
                case command.is(CommandType.ProgressDrawingCreation):
                    const newWidth = command.svgX - command.prevSvgX;
                    const newHeight = command.svgY - command.prevSvgY;
                    if (command.temporary === true)
                        this.svg.size(newWidth, newHeight, this._originX, this._originY);
                    else {
                        debugger;
                        this.setSize(newWidth, newHeight);
                    }
                        
                    break;
            }
        }
    }

    static new(data: NewDrawingCanvasInfo & NewDrawingMouseInfo): Circle {
        const drawing = new Circle();
        drawing.config(data);

        drawing.setOrigin(data.svgX, data.svgY);
        drawing.setSize(0, 0);

        return drawing;
    }

    protected setOrigin(newOriginX: number, newOriginY: number) {
        this._originX = newOriginX;
        this._originY = newOriginY;
        this.svg.origin(newOriginX, newOriginY);
    }

    protected setSize(newWidth: number, newHeight: number) {
        this._width = newWidth;
        this._height = newHeight;
        this.svg.size(this._width, this._height, this._originX, this._originY);
    }
}