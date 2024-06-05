import type { CanvasActionDTO, CanvasStateDTO, KeyboardDTO, MouseDTO } from "../CanvasData/Types";
import CanvasHandler from "./CanvasHandler";

type StateChangeFunc = (canvas: CanvasHandler) => void

export function main(state: CanvasActionDTO): StateChangeFunc | void {
    const nextState = handleMode(state.canvasData, state.keyboardData, state.mouseData);

    return nextState;
}

function handleMode(state: CanvasStateDTO, keyboard: KeyboardDTO, mouse: MouseDTO): StateChangeFunc | void {
    let nextState: StateChangeFunc | void;

    nextState = handleMove(state, keyboard, mouse);

    return nextState;
}

function handleMove(state: CanvasStateDTO, keyboard: KeyboardDTO,  mouse: MouseDTO): StateChangeFunc | void {
    let newX: number;
    let newY: number;

    if (state.currentMode !== "Move") {
        if (keyboard.keysPressed.get(" ") === "released" && mouse.left === "held") {
            newX = (mouse.prevSvgX - mouse.svgX) + state.viewX;
            newY = (mouse.prevSvgY - mouse.svgY) + state.viewY;
            return (currentState) => currentState.setViewBox(newX, newY, state.zoom);
        }
        return;
    }

    newX = (mouse.prevSvgX - mouse.svgX) + state.viewX;
    newY = (mouse.prevSvgY - mouse.svgY) + state.viewY;

    if (mouse.left === "held") {
        return (currentState) => currentState.setUIViewBox(newX, newY, state.zoom);
    }

    if (mouse.left === "released") {
        return (currentState) => currentState.setViewBox(newX, newY, state.zoom);
    }
}