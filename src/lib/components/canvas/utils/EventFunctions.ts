type Event = KeyboardEvent | MouseEvent | WheelEvent;

export function setAllEvents(handler: (event: Event) => void, element: SVGElement, currentThis: any) {
    const throttled = throttle(handler, 6.94);

    element.addEventListener("mousedown", (event: MouseEvent) => handler.call(currentThis, event));
    element.addEventListener("mouseup", (event: MouseEvent) => handler.call(currentThis, event));
    element.addEventListener("mousemove", (event: MouseEvent) => throttled.call(currentThis, event));
    element.addEventListener("keydown", (event: KeyboardEvent) => handler.call(currentThis, event));
    element.addEventListener("keyup", (event: KeyboardEvent) => handler.call(currentThis, event));
    element.addEventListener("wheel", (event: WheelEvent) => handler.call(currentThis, event));
}

function throttle<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let lastCall = 0; // Timestamp of the last function call
  
    return function(this: any, ...args: Parameters<T>) {
        const now = Date.now(); // Current timestamp
        const elapsed = now - lastCall;
    
        // If enough time has passed since the last call, execute the function
        if (elapsed >= delay) {
            func.apply(this, args);
            lastCall = now;
        }
    };
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