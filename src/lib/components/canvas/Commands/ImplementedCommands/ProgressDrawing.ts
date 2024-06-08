import { Interaction } from "../../Controllers/Types";
import { DrawingType } from "../../Drawings/Types";
import { BaseCommand, type CommandOptions } from "../BaseCommand";
import { CommandType } from "../Types";

type ProgressDrawingCommandCanvasInfo = {
    readonly currentMode: Interaction
    readonly fillColor: number | string
    readonly strokeColor: number | string
    readonly strokeWidth: number
    readonly roundedCorners: number
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
    readonly type: CommandType = CommandType.ProgressDrawingCreation;

    readonly svgX: number
    readonly svgY: number
    readonly prevSvgX: number
    readonly prevSvgY: number

    readonly currentMode!: DrawingType
    readonly fillColor: number | string
    readonly strokeColor: number | string
    readonly strokeWidth: number
    readonly roundedCorners: number

    constructor(mouseData: ProgressDrawingMouseInfo, canvasData: ProgressDrawingCommandCanvasInfo, options?: CommandOptions) {
        super(options);

        this.svgX = mouseData.svgX;
        this.svgY = mouseData.svgY;
        this.prevSvgX = mouseData.prevSvgX;
        this.prevSvgY = mouseData.prevSvgY;


        switch(canvasData.currentMode) {
            case Interaction.DrawCircle:
                this.currentMode = DrawingType.Circle;
                break;
            case Interaction.DrawLine:
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
        this.roundedCorners = canvasData.roundedCorners
    }
}