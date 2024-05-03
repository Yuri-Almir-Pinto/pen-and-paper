import * as TYPES from "../definitions";

export function sleep(time: number, callback?: () => undefined) {
    if (callback == null)
        return new Promise((resolve) => setTimeout(resolve, time))
    else
        return new Promise((resolve) => setTimeout(callback, time));
}

export function assertUnreachable(x: never): never {
    const exhaustiveCheck: never = x;
    throw new Error(`Unhandled actionType case: ${exhaustiveCheck}`);
}

function getLocalCords(this: HTMLElement, mouseCoords: MouseEvent): TYPES.Coords {
    const rect = this.getBoundingClientRect();

    const x = mouseCoords.clientX - rect.left;
    const y = mouseCoords.clientY - rect.top;

    return [x, y];
}

function isWithinRange(this: number, compareTo: number, range: number): boolean {
    if (this + range > compareTo && this - range < compareTo)
        return true;

    return false;
}

declare global {
    interface HTMLElement {
        getLocalCords: (coords: MouseEvent) => TYPES.Coords;
    }

    interface Number {
        isWithingRange: (compareTo: number, range: number) => boolean
    }
}
  
HTMLElement.prototype.getLocalCords = getLocalCords;
Number.prototype.isWithingRange = isWithinRange