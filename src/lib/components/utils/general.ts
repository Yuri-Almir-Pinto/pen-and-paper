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

function getLocalCords(this: HTMLElement, mouseCoords: MouseEvent): Coords {
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

function toVector2d(this: number[]): {x: number, y: number}[] {
    if (this.length % 2 != 0)
        return [];

    const array: {x: number, y: number}[] = [];

    for (let i = 0; i < this.length; i++) {
        array.push({x: this[i], y: this[i + 1]});
    }

    return array;
}

HTMLElement.prototype.getLocalCords = getLocalCords;
Number.prototype.isWithingRange = isWithinRange
Array.prototype.toVector2d = toVector2d;