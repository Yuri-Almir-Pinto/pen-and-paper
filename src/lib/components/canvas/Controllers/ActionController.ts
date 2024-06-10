import { ButtonState, Key, WheelState, type CanvasActionDTO } from "../State/Types";
import { type BaseCommand } from "../Commands/BaseCommand";
import { ResizeMainSVG } from "../Commands/ImplementedCommands/ResizeMainSVG";
import { Interaction } from "./Types";
import { NewDrawing } from "../Commands/ImplementedCommands/NewDrawing";
import { ProgressDrawing } from "../Commands/ImplementedCommands/ProgressDrawing";

export function createCommands(state: CanvasActionDTO): BaseCommand[] {
    const commands: BaseCommand[] = [];

    moveCommand(state, commands);
    zoomCommand(state, commands);
    newDrawingCommand(state, commands);
    progressDrawingCommand(state, commands);

    return commands;
}

function progressDrawingCommand({ keyboardData, mouseData, canvasData }: CanvasActionDTO, commands: BaseCommand[]) {
    if (canvasData.isDrawing === false || canvasData.currentMode === Interaction.Move)
        return
    
    const command = new ProgressDrawing(mouseData, canvasData, { temporary: leftMouseIsHeldOrModeIsDrawLine() });
    commands.push(command);

    
    if (finishedDrawingLineByDragging()) {
        const command = new ProgressDrawing(mouseData, canvasData);
        commands.pop();
        commands.push(command);
    }
    
    if (pressedEscWhileDrawingLine()) {
        const command = new ProgressDrawing(mouseData, canvasData);
        commands.pop();
        commands.push(command);
    }

    function leftMouseIsHeldOrModeIsDrawLine() {
        return mouseData.left === ButtonState.Held 
        || canvasData.currentMode === Interaction.DrawPath;
    }

    function pressedEscWhileDrawingLine() {
        return canvasData.currentMode === Interaction.DrawPath 
        && canvasData.isDrawing === true 
        && keyboardData.keysState.get(Key.Escape) === ButtonState.Pressed;
    }

    function finishedDrawingLineByDragging() {
        return canvasData.currentMode === Interaction.DrawPath
        && mouseData.isLeftClick === false
        && mouseData.left === ButtonState.Released
    }
}

function newDrawingCommand({ mouseData, canvasData }: CanvasActionDTO, commands: BaseCommand[]) {
    if (canvasData.currentMode === Interaction.Move || mouseData.left !== ButtonState.Pressed || canvasData.isDrawing === true)
        return;

    const command = new NewDrawing(mouseData, canvasData, { canUndo: true });
    commands.push(command);
}

function zoomCommand({ keyboardData, mouseData, canvasData }: CanvasActionDTO, commands: BaseCommand[]): void {
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

function moveCommand({ keyboardData, mouseData, canvasData, combinedData }: CanvasActionDTO, commands: BaseCommand[]): void {
    if (canvasData.currentMode !== Interaction.Move)
        return;
    
    const spaceState = keyboardData.keysState.get(Key.Space);
    let newX: number;
    let newY: number;

    if (spaceState === ButtonState.Pressed || spaceState === ButtonState.Held) {
        const spacePressCoords = combinedData.keyPressedCords.get(Key.Space);
        if (spacePressCoords == null) {
            console.error("spacePressCoords was null when it shouldn't.");
            return;
        }

        newX = (spacePressCoords.x - mouseData.svgX) + canvasData.viewX;
        newY = (spacePressCoords.y - mouseData.svgY) + canvasData.viewY;
    }
    else if (mouseData.left === ButtonState.Held) {
        newX = (mouseData.prevSvgX - mouseData.svgX) + canvasData.viewX;
        newY = (mouseData.prevSvgY - mouseData.svgY) + canvasData.viewY;
    }
    else
        return;
    
    const command = new ResizeMainSVG(newX, newY, canvasData.zoom);
    commands.push(command);
}
