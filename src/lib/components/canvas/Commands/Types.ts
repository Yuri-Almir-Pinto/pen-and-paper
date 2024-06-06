import type { Command, ResizeMainSVG, ToggleMoveMainSVG } from "./Command";

export enum CommandType {
    Command,
    ResizeMainSVG,
    ToggleMoveMainSVG,
}

export type CommandMap = {
    [CommandType.Command]: Command
    [CommandType.ResizeMainSVG]: ResizeMainSVG
    [CommandType.ToggleMoveMainSVG]: ToggleMoveMainSVG
}

export interface Executable {
    execute(commands: Command[]): void
}