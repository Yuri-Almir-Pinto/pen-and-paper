import type { BaseCommand } from "./BaseCommand";
import type { ToggleMoveMainSVG } from "./ImplementedCommands/ToggleMoveMainSVG";
import type { ResizeMainSVG } from "./ImplementedCommands/ResizeMainSVG";
import type { NewDrawing } from "./ImplementedCommands/NewDrawing";
import type { ProgressDrawing } from "./ImplementedCommands/ProgressDrawing";

export enum CommandType {
    BaseCommand,
    ResizeMainSVG,
    ToggleMoveMainSVG,
    NewDrawing,
    ProgressDrawingCreation,
}

export type CommandMap = {
    [CommandType.BaseCommand]: BaseCommand
    [CommandType.ResizeMainSVG]: ResizeMainSVG
    [CommandType.ToggleMoveMainSVG]: ToggleMoveMainSVG
    [CommandType.NewDrawing]: NewDrawing
    [CommandType.ProgressDrawingCreation]: ProgressDrawing
}

export interface Executable {
    execute(commands: BaseCommand[]): void
}