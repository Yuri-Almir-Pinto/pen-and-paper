import type { CanvasActionDTO } from "../CanvasData/Types";
import { ResizeMainSVG, type Command } from "../Commands/Command";
import CanvasHandler from "./CanvasHandler";

type StateChangeFunc = (canvas: CanvasHandler) => void

export function createCommands(state: CanvasActionDTO): Command[] {
    const commands: Command[] = [];

    moveCommand(state, commands);

    return commands;
}

function moveCommand(state: CanvasActionDTO, commands: Command[]): StateChangeFunc | void {
    const { canvasData, mouseData, keyboardData } = state;
    const spaceState = keyboardData.keysPressed.get(" ");
    let newX: number;
    let newY: number;
    let dataSet: boolean = false;

    if (canvasData.currentMode === "Move" || spaceState === "pressed" || spaceState === "held") {
        newX = (mouseData.prevSvgX - mouseData.svgX) + canvasData.viewX;
        newY = (mouseData.prevSvgY - mouseData.svgY) + canvasData.viewY;
        dataSet = true;
    }

    if (mouseData.left === "held" && dataSet === true) {
        const command = new ResizeMainSVG(newX!, newY!, canvasData.zoom);
        command.definitive = false;
        commands.push(command);
    }

    if (mouseData.left === "released" && dataSet === true) {
        const command = new ResizeMainSVG(newX!, newY!, canvasData.zoom);
        commands.push(command);
    }
}