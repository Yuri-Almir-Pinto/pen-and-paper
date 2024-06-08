import { BaseCommand, type CommandOptions } from "../BaseCommand";

import { CommandType } from "../Types";

export class ResizeMainSVG extends BaseCommand {
    type: CommandType = CommandType.ResizeMainSVG;
    viewX: number;
    viewY: number;
    zoom: number;

    constructor(newViewX: number, newViewY: number, zoom: number, options?: CommandOptions) {
        super(options);

        this.viewX = newViewX;
        this.viewY = newViewY;
        this.zoom = zoom;
    }
}
