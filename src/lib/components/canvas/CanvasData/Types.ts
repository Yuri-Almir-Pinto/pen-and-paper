import type { Interaction } from "../CanvasHandlers/Types";

export enum ButtonState {
    None, Pressed, Held, Released
}

export enum WheelState {
    None, Up, Down
}

type ButtonStateObject = Map<string, ButtonState>

export function updateButtonState(state: ButtonState): ButtonState;
export function updateButtonState(state: ButtonStateObject): ButtonStateObject;
export function updateButtonState(state: ButtonState | ButtonStateObject): ButtonState | ButtonStateObject {
    if (typeof state === "object") {
        for (let [key, value] of state)
            state.set(key, update(value));

        return state;
    }
    else {
        return update(state);
    }

    function update(toUpdate: ButtonState): ButtonState {
        if (toUpdate === ButtonState.Pressed)
            return ButtonState.Held;
        if (toUpdate === ButtonState.Released)
            return ButtonState.None;

        return toUpdate;
    }
}

export function updateWheelState(state: WheelState): WheelState {
    return WheelState.None
}

export type MouseButtons = {
    left: ButtonState
    right: ButtonState
    middle: ButtonState
}

export type KeyboardButtons = ButtonStateObject

export interface CanvasStateDTO {
    readonly currentMode: Interaction
    readonly fillColor: number | string
    readonly strokeColor: number | string
    readonly strokeWidth: number
    readonly roundedCorners: number
    readonly zoom: number
    readonly viewX: number
    readonly viewY: number
    readonly svgWidth: number
    readonly svgHeight: number
    readonly viewWidth: number
    readonly viewHeight: number
    leftDistancePercentage(svgX: number): number
    topDistancePercentage(svgY: number): number
}

export interface KeyboardDTO {
    readonly keysPressed: ReadonlyMap<string, ButtonState>
    readonly altKey: boolean
    readonly shiftKey: boolean
    readonly ctrlKey: boolean
    readonly timeStamp: number
}

export interface MouseDTO {
    readonly left: ButtonState
    readonly right: ButtonState
    readonly middle: ButtonState
    readonly wheel: WheelState
    readonly layerX: number
    readonly layerY: number
    readonly svgX: number
    readonly svgY: number
    readonly prevSvgX: number
    readonly prevSvgY: number
    readonly altPressed: boolean
    readonly shiftPressed: boolean
    readonly timestamp: number
}

export interface CanvasActionDTO {
    readonly mouseData: MouseDTO
    readonly keyboardData: KeyboardDTO
    readonly canvasData: CanvasStateDTO
}