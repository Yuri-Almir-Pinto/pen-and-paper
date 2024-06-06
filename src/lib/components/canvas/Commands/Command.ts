import { CommandType, type CommandMap } from "./Types";

type CommandOptions = {
    canUndo?: boolean
    definitive?: boolean
}

export class Command {
    type: CommandType = CommandType.Command
    canUndo: boolean
    definitive: boolean

    constructor(options?: CommandOptions) {
        this.canUndo = options?.canUndo != null ? options.canUndo : false;
        this.definitive = options?.definitive != null ? options.definitive : true;
    }

    is<T extends keyof CommandMap>(type: T): this is CommandMap[T] {
        return type === this.type;
    }
}

export class ResizeMainSVG extends Command {
    type: CommandType = CommandType.ResizeMainSVG
    viewX: number
    viewY: number
    zoom: number

    constructor(x: number, y: number, zoom: number, options?: CommandOptions) {
        super(options)

        this.viewX = x;
        this.viewY = y;
        this.zoom = zoom;
    }
}

export class ToggleMoveMainSVG extends Command {
    type: CommandType = CommandType.ToggleMoveMainSVG
    value: boolean

    constructor(value: boolean, options?: CommandOptions) {
        super(options);

        this.value = value;
    }
}