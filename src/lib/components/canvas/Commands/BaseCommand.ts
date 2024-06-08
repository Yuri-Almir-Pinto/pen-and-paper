import { CommandType, type CommandMap } from "./Types";

export type CommandOptions = {
    canUndo?: boolean
    temporary?: boolean
}

export class BaseCommand {
    readonly type: CommandType = CommandType.BaseCommand
    readonly canUndo: boolean
    readonly temporary: boolean

    constructor(options?: CommandOptions) {
        this.canUndo = options?.canUndo != null ? options.canUndo : false;
        this.temporary = options?.temporary != null ? options.temporary : false;
    }

    is<T extends keyof CommandMap>(type: T): this is CommandMap[T] {
        return type === this.type;
    }
}

