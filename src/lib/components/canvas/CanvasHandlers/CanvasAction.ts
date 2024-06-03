import type { CanvasActionDTO, CanvasStateDTO, KeyboardDTO, MouseDTO } from "../ActionData/Types";
import CanvasHandler from "./CanvasHandler";

type StateChangeFunc = (canvas: CanvasHandler) => void

export function main(state: CanvasActionDTO): [StateChangeFunc | void, boolean] {
    const newState = stateChangePhase(state);

    if (newState != null) return [newState, true];

    const nextState = progressPhase(state);

    return [nextState, false];
}

function stateChangePhase(state: CanvasActionDTO): StateChangeFunc | void {
    switch(true) {
        case state.keyboardData.keysPressed.get("Space") === "pressed":
            return (state) => state.toggleMove(true); 
        case state.keyboardData.keysPressed.get("Space") === "released":
            return (state) => state.toggleMove(false);
        default:
            break;
    }
}

function progressPhase(state: CanvasActionDTO): StateChangeFunc | void {
    return handleMode(state.canvasData, state.keyboardData, state.mouseData)
}

function handleMode(state: CanvasStateDTO, keyboard: KeyboardDTO, mouse: MouseDTO): StateChangeFunc | void {
    switch(state.currentMode) {
        case "Move":
            const newX = (mouse.prevSvgX - mouse.svgX) + state.viewX;
            const newY = (mouse.prevSvgY - mouse.svgY) + state.viewY;

            if (mouse.left === "held") {
                return (currentState) => currentState.setUIViewBox(newX, newY, state.zoom);
            }
            else if (mouse.left === "released") {
                return (currentState) => currentState.setViewBox(newX, newY, state.zoom);
            }
        default:
            return;
    }
}