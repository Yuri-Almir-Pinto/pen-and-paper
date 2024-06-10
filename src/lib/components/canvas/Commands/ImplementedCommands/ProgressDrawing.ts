import { Interaction } from "../../Controllers/Types";
import { DrawingType } from "../../Drawings/Types";
import { ButtonState } from "../../State/Types";
import { BaseCommand, type CommandOptions } from "../BaseCommand";
import { CommandType } from "../Types";

type ProgressDrawingCommandCanvasArgument = {
    readonly currentMode: Interaction
    readonly fillColor: number | string
    readonly strokeColor: number | string
    readonly strokeWidth: number
    readonly roundedCorners: number
}

type ProgressDrawingCommandMouseArgument = {
    readonly svgX: number
    readonly svgY: number
    readonly prevSvgX: number
    readonly prevSvgY: number
    readonly left: ButtonState
    readonly isLeftClick: boolean
}

export type ProgressDrawingMouseInfo = {
    readonly svgX: number
    readonly svgY: number
    readonly prevSvgX: number
    readonly prevSvgY: number
};

export type ProgressDrawingCanvasInfo = {
    readonly currentMode: DrawingType
    readonly fillColor: number | string
    readonly strokeColor: number | string
    readonly strokeWidth: number
    readonly roundedCorners: number
};

export class ProgressDrawing extends BaseCommand implements ProgressDrawingMouseInfo, ProgressDrawingCanvasInfo {
    readonly type: CommandType = CommandType.ProgressDrawing;

    readonly svgX: number
    readonly svgY: number
    readonly prevSvgX: number
    readonly prevSvgY: number
    readonly isLeftClick: boolean

    readonly currentMode!: DrawingType
    readonly fillColor: number | string
    readonly strokeColor: number | string
    readonly strokeWidth: number
    readonly roundedCorners: number

    constructor(mouseData: ProgressDrawingCommandMouseArgument, 
        canvasData: ProgressDrawingCommandCanvasArgument, 
        options?: CommandOptions) {
        super(options);

        this.svgX = mouseData.svgX;
        this.svgY = mouseData.svgY;
        this.prevSvgX = mouseData.prevSvgX;
        this.prevSvgY = mouseData.prevSvgY;
        this.isLeftClick = mouseData.isLeftClick;

        switch(canvasData.currentMode) {
            case Interaction.DrawCircle:
                this.currentMode = DrawingType.Circle;
                break;
            case Interaction.DrawPath:
                this.currentMode = DrawingType.Path;
                break;
            case Interaction.DrawSquare:
                this.currentMode = DrawingType.Square;
                break;
            default:
                console.error("Error when creating a new drawing command: currentMode was not a valid shape.");
        }
        
        this.fillColor = canvasData.fillColor;
        this.strokeColor = canvasData.strokeColor;
        this.strokeWidth = canvasData.strokeWidth;
        this.roundedCorners = canvasData.roundedCorners;
    }
}