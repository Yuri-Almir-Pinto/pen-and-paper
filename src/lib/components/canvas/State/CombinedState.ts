import type KeyboardState from "./KeyboardState";
import type MouseState from "./MouseState";
import { ButtonState, type CombinedDTO, type Key } from "./Types"

export default class CombinedState implements CombinedDTO {
    keyPressedCords: Map<Key, { x: number; y: number; }>;

    constructor() {
        this.keyPressedCords = new Map();
    }

    update(mouseState: MouseState, keyboardState: KeyboardState) {
        for (let [key, value] of keyboardState.keysState) {
            if (value === ButtonState.Pressed) {
                const currentCoords = {
                    x: mouseState.svgX,
                    y: mouseState.svgY,
                }

                this.keyPressedCords.set(key, currentCoords);
            }
            else if (value === ButtonState.None)
                this.keyPressedCords.delete(key);
        }
    }
}