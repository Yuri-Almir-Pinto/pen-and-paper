export type ButtonState = "none" | "pressed" | "held" | "released"

type ButtonStateObject = { [key: string]: ButtonState }

export function updateButtonState(state: ButtonState): ButtonState;
export function updateButtonState(state: ButtonStateObject): ButtonStateObject;
export function updateButtonState(state: ButtonState | ButtonStateObject): ButtonState | ButtonStateObject {
    if (typeof state === "object") {
        for (let key in state)
            state[key] = update(state[key]);

        return state;
    }
    else {
        return update(state);
    }

    function update(toUpdate: ButtonState): ButtonState {
        if (toUpdate === "pressed")
            return "held";
        if (toUpdate === "released")
            return "none";

        return toUpdate;
    }
}

export type MouseButtons = {
    left: ButtonState
    right: ButtonState
    middle: ButtonState
}

export type KeyboardButtons = ButtonStateObject