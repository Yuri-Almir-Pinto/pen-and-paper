import { readonly } from "svelte/store"
import { ButtonState, updateButtonState, type KeyboardButtons, type KeyboardDTO } from "./Types"

type RelevantKeyboardData = {timeStamp: number, shiftKey: boolean, altKey: boolean, ctrlKey: boolean, type: string, key: string}

export default class KeyboardData implements KeyboardDTO {
    keysPressed: KeyboardButtons
    altKey: boolean
    shiftKey: boolean
    ctrlKey: boolean
    timeStamp: number

    constructor() {
        this.keysPressed = new Map()
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
            this.keysPressed.set(event.key, ButtonState.Pressed);
        }
        else if (event.type === "keyup") {
            this.keysPressed.set(event.key, ButtonState.Released);
        }
    }

    commit(): KeyboardDTO {
        const frozenKeysPressed = Object.freeze(new Map([...this.keysPressed]));
        const frozen = Object.freeze({ ...this, keysPressed: frozenKeysPressed });
    
        return frozen;
    }

    updateButtons() { this.keysPressed = updateButtonState(this.keysPressed) }
}