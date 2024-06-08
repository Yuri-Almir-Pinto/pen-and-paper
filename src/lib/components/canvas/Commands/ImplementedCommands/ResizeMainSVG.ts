import { BaseCommand, type CommandOptions } from "../BaseCommand";

import { CommandType } from "../Types";

export class ResizeMainSVG extends BaseCommand {
    readonly type: CommandType = CommandType.ResizeMainSVG;
    readonly viewX: number;
    readonly viewY: number;
    readonly zoom: number;

    constructor(newViewX: number, newViewY: number, zoom: number, options?: CommandOptions) {
        super(options);

        this.viewX = newViewX;
        this.viewY = newViewY;
        this.zoom = zoom;
    }
}
