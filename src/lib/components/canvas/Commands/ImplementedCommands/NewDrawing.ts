import { Interaction } from "../../Controllers/Types";
import { DrawingType } from "../../Drawings/Types";
import { BaseCommand, type CommandOptions } from "../BaseCommand";
import { CommandType } from "../Types";

type NewDrawingCommandCanvasInfo = {
    readonly currentMode: Interaction;
    readonly fillColor: number | string;
    readonly strokeColor: number | string;
    readonly strokeWidth: number;
    readonly roundedCorners: number;
}

export type NewDrawingMouseInfo = {
    readonly svgX: number;
    readonly svgY: number;
};

export type NewDrawingCanvasInfo = {
    readonly currentMode: DrawingType;
    readonly fillColor: number | string;
    readonly strokeColor: number | string;
    readonly strokeWidth: number;
    readonly roundedCorners: number;
};

export class NewDrawing extends BaseCommand implements NewDrawingMouseInfo, NewDrawingCanvasInfo {
    readonly type: CommandType = CommandType.NewDrawing;

    readonly svgX: number
    readonly svgY: number

    readonly currentMode!: DrawingType
    readonly fillColor: number | string
    readonly strokeColor: number | string
    readonly strokeWidth: number
    readonly roundedCorners: number

    constructor(mouseData: NewDrawingMouseInfo, canvasData: NewDrawingCommandCanvasInfo, options?: CommandOptions) {
        super(options);

        this.svgX = mouseData.svgX;
        this.svgY = mouseData.svgY;

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
        this.roundedCorners = canvasData.roundedCorners
    }
}
