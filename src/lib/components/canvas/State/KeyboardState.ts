import { readonly } from "svelte/store"
import { ButtonState, Key, updateButtonState, type KeyboardButtons, type KeyboardDTO } from "./Types"

interface RelevantKeyboardData {timeStamp: number, shiftKey: boolean, altKey: boolean, ctrlKey: boolean, type: string, key: string}

export default class KeyboardState implements KeyboardDTO {
    keysState: KeyboardButtons
    altKey: boolean
    shiftKey: boolean
    ctrlKey: boolean
    timeStamp: number

    constructor() {
        this.keysState = new Map()
        this.timeStamp = 0;
        this.shiftKey = false;
        this.altKey = false;
        this.ctrlKey = false;
    }

    update(event: RelevantKeyboardData) {
        this.timeStamp = event.timeStamp;
        this.shiftKey = event.shiftKey;
        this.altKey = event.altKey;
        this.ctrlKey = event.ctrlKey;

        if (event.type === "keydown") {
            this.keysState.set(event.key as Key, ButtonState.Pressed);
        }
        else if (event.type === "keyup") {
            this.keysState.set(event.key as Key, ButtonState.Released);
        }
    }

    commit(): KeyboardDTO {
        const frozenKeysPressed = Object.freeze(new Map([...this.keysState]));
        const frozen = Object.freeze({ ...this, keysState: frozenKeysPressed });
    
        return frozen;
    }

    updateButtons() { this.keysState = updateButtonState(this.keysState) }
}