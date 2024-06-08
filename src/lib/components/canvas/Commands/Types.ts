import type { BaseCommand } from "./BaseCommand";
import type { ToggleMoveMainSVG } from "./ImplementedCommands/ToggleMoveMainSVG";
import type { ResizeMainSVG } from "./ImplementedCommands/ResizeMainSVG";

export enum CommandType {
    BaseCommand,
    ResizeMainSVG,
    ToggleMoveMainSVG,
}

export type CommandMap = {
    [CommandType.BaseCommand]: BaseCommand
    [CommandType.ResizeMainSVG]: ResizeMainSVG
    [CommandType.ToggleMoveMainSVG]: ToggleMoveMainSVG
}

export interface Executable {
    execute(commands: BaseCommand[]): void
}