import { BaseCommand, type CommandOptions } from "../BaseCommand";
import { CommandType } from "../Types";


export class TestDraw100 extends BaseCommand {
    readonly type: CommandType = CommandType.TestDraw100

    constructor(options?: CommandOptions) {
        super(options);
    }
}