import type { KeyboardButtons } from "./Types"

export default class KeyboardDTO {
    keysPressed: Readonly<KeyboardButtons> = {}
    altPressed: boolean
    shiftPressed: boolean
    timestamp: number

    constructor(event: KeyboardEvent, keysPressed: KeyboardButtons) {
        this.keysPressed = keysPressed;
        this.timestamp = event.timeStamp;
        this.shiftPressed = event.shiftKey;
        this.altPressed = event.altKey;
    }

    commit(): Readonly<KeyboardDTO> {
        this.keysPressed = Object.freeze(this.keysPressed);

        return Object.freeze(this);
    }
}