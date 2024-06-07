import { ButtonState, WheelState, type CanvasActionDTO } from "../State/Types";
import { ResizeMainSVG, type Command } from "../Commands/Command";
import { Interaction } from "./Types";

export function createCommands(state: CanvasActionDTO): Command[] {
    const commands: Command[] = [];

    moveCommand(state, commands);
    zoomCommand(state, commands);

    return commands;
}

function zoomCommand(state: CanvasActionDTO, commands: Command[]): void {
    const { keyboardData, mouseData, canvasData } = state;

    if (keyboardData.ctrlKey === false || mouseData.wheel == WheelState.None)
        return;

    const inOrOut = mouseData.wheel === WheelState.Up ? "in" : "out"
    const zoomChange = inOrOut === "in" ? 0.85 : 1.15
    const newZoom = canvasData.zoom * zoomChange;
    // Calcula a distância do topo/esquerda para o mouse em % (Um mouse totalmente a esquerda seria 0, totalmente a direita seria 1, no meio 0.5, etc)
    const distanceX = canvasData.leftDistancePercentage(mouseData.layerX);
    const distanceY = canvasData.topDistancePercentage(mouseData.layerY);
    
    const originX = canvasData.viewX;
    const originY = canvasData.viewY;
    
    const oldWidth = canvasData.viewWidth;
    const oldHeight = canvasData.viewHeight;
    // Pega o tamanho do SVG em si, e aplica o zoom nele.
    const newWidth = canvasData.svgWidth * newZoom;
    const newHeight = canvasData.svgHeight * newZoom;
    
    const diffWidth = oldWidth - newWidth;
    const diffHeight = oldHeight - newHeight;
    // Calcula a nova posição da origem da tela, de forma que a posição do mouse dentro do SVG se mantenha a mesma após o zoom.
    const newOriginX = originX + (distanceX * diffWidth);
    const newOriginY = originY + (distanceY * diffHeight);

    const command = new ResizeMainSVG(newOriginX, newOriginY, newZoom);
    commands.push(command);
}

function moveCommand(state: CanvasActionDTO, commands: Command[]): void {
    const { canvasData, mouseData, keyboardData } = state;
    const spaceState = keyboardData.keysPressed.get(" ");
    let newX: number;
    let newY: number;
    let dataSet: boolean = false;

    if (canvasData.currentMode === Interaction.Move || spaceState === ButtonState.Pressed || spaceState === ButtonState.Held) {
        newX = (mouseData.prevSvgX - mouseData.svgX) + canvasData.viewX;
        newY = (mouseData.prevSvgY - mouseData.svgY) + canvasData.viewY;
        dataSet = true;
    }

    if (mouseData.left === ButtonState.Held && dataSet === true) {
        const command = new ResizeMainSVG(newX!, newY!, canvasData.zoom);
        command.temporary = true;
        commands.push(command);
    }

    if (mouseData.left === ButtonState.Released && dataSet === true) {
        const command = new ResizeMainSVG(newX!, newY!, canvasData.zoom);
        commands.push(command);
    }
}