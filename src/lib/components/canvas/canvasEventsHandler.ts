import { assertUnreachable } from "../utils/general";

enum EventType {
    up, down, click, doubleClick, move, keydown, keyup, wheel
}

export class CanvasEventsHandler {
    private _mouseDownHandler: CustomMouseEventHandler
    private _mouseUpHandler: CustomMouseEventHandler
    private _mouseClickHandler: CustomMouseEventHandler
    private _mouseDoubleClickHandler: CustomMouseEventHandler
    private _mouseMoveHandler: CustomMouseEventHandler
    private _keydownHandler: CustomKeyboardEventHandler
    private _keyupHandler: CustomKeyboardEventHandler
    private _wheelHandler: CustomWheelEventHandler
    private _handler: IEventHandlers
    private _downMousePostion!: Coords
    private _sinceLastDown: number = Date.now()
    private _sinceLastClick: number = Date.now()
    static acceptableRange: number = 25

    constructor(handler: IEventHandlers, app: SVGElement) {
        this._handler = handler;
        this._mouseDownHandler = handler.mouseDownHandler;
        this._mouseUpHandler = handler.mouseUpHandler;
        this._mouseClickHandler = handler.mouseClickHandler;
        this._mouseDoubleClickHandler = handler.mouseDoubleClickHandler;
        this._mouseMoveHandler = handler.mouseMoveHandler;
        this._keydownHandler = handler.keydownHandler;
        this._keyupHandler = handler.keyUpHandler;
        this._wheelHandler = handler.wheelHandler;

        app.addEventListener("mousedown", (event: MouseEvent) => this._handleMouseDown(event));
        app.addEventListener("mouseup", (event: MouseEvent) => this._handleMouseUp(event));
        app.addEventListener("mousemove", (event: MouseEvent) => this._handleMouseMove(event));
        app.addEventListener("keydown", (event: KeyboardEvent) => this._handleKeyDown(event));
        app.addEventListener("keyup", (event: KeyboardEvent) => this._handleKeyUp(event));
        app.addEventListener("wheel", (event: WheelEvent) => this._handleWheel(event));

        app.tabIndex = 0;
    }

    private _fire(type: EventType, event: MouseEvent | KeyboardEvent | WheelEvent) {
        switch(type) {
            case EventType.click: this._mouseClickHandler.call(this._handler, event as MouseEvent); return;
            case EventType.doubleClick: this._mouseDoubleClickHandler.call(this._handler, event as MouseEvent); return;
            case EventType.up: this._mouseUpHandler.call(this._handler, event as MouseEvent); return;
            case EventType.down: this._mouseDownHandler.call(this._handler, event as MouseEvent); return;
            case EventType.move: this._mouseMoveHandler.call(this._handler, event as MouseEvent); return;
            case EventType.keydown: this._keydownHandler.call(this._handler, event as KeyboardEvent); return;
            case EventType.keyup: this._keyupHandler.call(this._handler, event as KeyboardEvent); return;
            case EventType.wheel: this._wheelHandler.call(this._handler, event as WheelEvent); return;
            default: assertUnreachable(type);
        }
    }

    private _handleMouseDown(event: MouseEvent) {
        this._sinceLastDown = Date.now();
        const { layerX: x, layerY: y } = event;
        this._downMousePostion = [x, y];
        this._fire(EventType.down, event);
    }

    private _handleMouseUp(event: MouseEvent) {
        if (Date.now() - this._sinceLastDown < 100) {

            this._fire(EventType.click, event);

            if (Date.now() - this._sinceLastClick < 200)
                this._fire(EventType.doubleClick, event);

            this._sinceLastClick = Date.now();
        }
        else {
            this._fire(EventType.up, event);
        }
    }

    private _handleMouseMove(event: MouseEvent) {
        this._fire(EventType.move, event);

    }

    private _handleKeyDown(event: KeyboardEvent) {
        this._fire(EventType.keydown, event);
    }

    private _handleKeyUp(event: KeyboardEvent) {
        this._fire(EventType.keyup, event);
    }

    private _handleWheel(event: WheelEvent) {
        this._fire(EventType.wheel, event);
    }
}