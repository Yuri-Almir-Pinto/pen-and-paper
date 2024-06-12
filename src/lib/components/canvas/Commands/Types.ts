import type { BaseCommand } from "./BaseCommand";
import type { ToggleMoveMainSVG } from "./ImplementedCommands/ToggleMoveMainSVG";
import type { ResizeMainSVG } from "./ImplementedCommands/ResizeMainSVG";
import type { NewDrawing } from "./ImplementedCommands/NewDrawing";
import type { ProgressDrawing } from "./ImplementedCommands/ProgressDrawing";
import type { TestDraw100 } from "./ImplementedCommands/TestDraw100";

export enum CommandType {
    BaseCommand,
    ResizeMainSVG,
    ToggleMoveMainSVG,
    NewDrawing,
    ProgressDrawing,
    TestDraw100
}

export type CommandMap = {
    [CommandType.BaseCommand]: BaseCommand
    [CommandType.ResizeMainSVG]: ResizeMainSVG
    [CommandType.ToggleMoveMainSVG]: ToggleMoveMainSVG
    [CommandType.NewDrawing]: NewDrawing
    [CommandType.ProgressDrawing]: ProgressDrawing
    [CommandType.TestDraw100]: TestDraw100
}