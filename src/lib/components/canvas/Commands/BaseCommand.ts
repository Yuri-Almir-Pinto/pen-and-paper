import { CommandType, type CommandMap } from "./Types";

export type CommandOptions = {
    canUndo?: boolean
    temporary?: boolean
}

export class BaseCommand {
    type: CommandType = CommandType.BaseCommand
    canUndo: boolean
    temporary: boolean

    constructor(options?: CommandOptions) {
        this.canUndo = options?.canUndo != null ? options.canUndo : false;
        this.temporary = options?.temporary != null ? options.temporary : false;
    }

    is<T extends keyof CommandMap>(type: T): this is CommandMap[T] {
        console.error("Some Command class called the base Command 'is'. This should not happen.");
        return type === this.type;
    }
}

