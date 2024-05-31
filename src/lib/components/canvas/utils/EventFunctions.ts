type Event = KeyboardEvent | MouseEvent | WheelEvent;

export function setAllEvents(handler: (event: Event) => void, element: SVGElement) {
    element.addEventListener("mousedown", (event: MouseEvent) => handler(event));
    element.addEventListener("mouseup", (event: MouseEvent) => handler(event));
    element.addEventListener("mousemove", (event: MouseEvent) => handler(event));
    element.addEventListener("keydown", (event: KeyboardEvent) => handler(event));
    element.addEventListener("keyup", (event: KeyboardEvent) => handler(event));
    element.addEventListener("wheel", (event: WheelEvent) => handler(event));
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