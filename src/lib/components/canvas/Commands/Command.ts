import { CommandType, type CommandMap } from "./Types";

type CommandOptions = {
    canUndo?: boolean
    temporary?: boolean
}

export class Command {
    type: CommandType = CommandType.Command
    canUndo: boolean
    temporary: boolean

    constructor(options?: CommandOptions) {
        this.canUndo = options?.canUndo != null ? options.canUndo : false;
        this.temporary = options?.temporary != null ? options.temporary : false;
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

    constructor(newViewX: number, newViewY: number, zoom: number, options?: CommandOptions) {
        super(options)

        this.viewX = newViewX;
        this.viewY = newViewY;
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