type Event = KeyboardEvent | MouseEvent | WheelEvent;

export function setAllEvents(handler: (event: Event) => void, element: SVGElement, currentThis: any) {
    const throttled = throttle(handler, 6.94);
    const blockedRepeatedCalls = blockRepeatedCalls(handler);

    element.addEventListener("mousedown", (event: MouseEvent) => handler.call(currentThis, event));
    element.addEventListener("mouseup", (event: MouseEvent) => handler.call(currentThis, event));
    element.addEventListener("mousemove", (event: MouseEvent) => throttled.call(currentThis, event));
    element.addEventListener("keydown", (event: KeyboardEvent) => blockedRepeatedCalls.call(currentThis, event));
    element.addEventListener("keyup", (event: KeyboardEvent) => blockedRepeatedCalls.call(currentThis, event));
    element.addEventListener("wheel", (event: WheelEvent) => handler.call(currentThis, event));
}

function throttle<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let lastCall = 0;
  
    return function(this: any, ...args: Parameters<T>) {
        const now = Date.now();
        const elapsed = now - lastCall;
    
        if (elapsed >= delay) {
            func.apply(this, args);
            lastCall = now;
        }
    };
}

function blockRepeatedCalls(handler: (event: KeyboardEvent) => void) {
    const keyMap = new Map<string, boolean>();

    return function(this: any, event: KeyboardEvent) {
        if (event.type === "keydown" && keyMap.get(event.key) === true)
            return;

        else if (event.type === "keydown" && (keyMap.get(event.key) === false || keyMap.get(event.key) === undefined))
            keyMap.set(event.key, true);

        if (event.type === "keyup")
            keyMap.set(event.key, false);

        handler.call(this, event);
    }
}

export function isKeyboardEvent(event: Event): event is KeyboardEvent {
    return "key" in event
}

export function isMouseEvent(event: Event): event is MouseEvent {
    return !("deltaY" in event) && !("key" in event)
}

export function isWheelEvent(event: Event): event is WheelEvent {
    return "deltaY" in event
}