import { readonly } from "svelte/store"
import { updateButtonState, type KeyboardButtons, type KeyboardDTO } from "./Types"

type RelevantKeyboardData = {timeStamp: number, shiftKey: boolean, altKey: boolean, type: string, key: string}

export default class KeyboardData implements KeyboardDTO {
    keysPressed: KeyboardButtons
    altKey: boolean
    shiftKey: boolean
    timeStamp: number

    constructor() {
        this.keysPressed = new Map()
        this.timeStamp = 0;
        this.shiftKey = false;
        this.altKey = false;
    }

    update(event: RelevantKeyboardData) {
        this.timeStamp = event.timeStamp;
        this.shiftKey = event.shiftKey;
        this.altKey = event.altKey;

        if (event.type === "keydown") {
            this.keysPressed.set(event.key, "pressed");
        }
        else if (event.type === "keyup") {
            this.keysPressed.set(event.key, "released");
        }
    }

    commit(): KeyboardDTO {
        const frozenKeysPressed = Object.freeze(new Map([...this.keysPressed]));
        const frozen = Object.freeze({ ...this, keysPressed: frozenKeysPressed });
    
        return frozen;
    }

    updateButtons() { this.keysPressed = updateButtonState(this.keysPressed) }
}