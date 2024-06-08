import { BaseCommand, type CommandOptions } from "../BaseCommand";
import { CommandType } from "../Types";

export class ToggleMoveMainSVG extends BaseCommand {
    readonly type: CommandType = CommandType.ToggleMoveMainSVG;
    readonly value: boolean;

    constructor(value: boolean, options?: CommandOptions) {
        super(options);

        this.value = value;
    }
}
