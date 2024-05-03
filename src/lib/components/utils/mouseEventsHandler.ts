import * as TYPES from "../definitions";
import { assertUnreachable } from "../utils/general";

enum EventType {
    up, down, click, doubleClick, move
}



export class mouseEventsHandler {
    private _mouseDownHandler: TYPES.CustomMouseEventHandler
    private _mouseUpHandler: TYPES.CustomMouseEventHandler
    private _mouseClickHandler: TYPES.CustomMouseEventHandler
    private _mouseDoubleClickHandler: TYPES.CustomMouseEventHandler
    private _mouseMoveHandler: TYPES.CustomMouseEventHandler
    private _handler: TYPES.IMouseEvents
    private _downMousePostion!: TYPES.Coords
    private _sinceLastClick: number = Date.now()
    static acceptableRange: number = 25

    constructor(handler: TYPES.IMouseEvents, elementToHandle: HTMLElement) {
        this._handler = handler;
        this._mouseDownHandler = handler.mouseDownHandler;
        this._mouseUpHandler = handler.mouseUpHandler;
        this._mouseClickHandler = handler.mouseClickHandler;
        this._mouseDoubleClickHandler = handler.mouseDoubleClickHandler;
        this._mouseMoveHandler = handler.mouseMoveHandler;

        elementToHandle.addEventListener("mousedown", (event: MouseEvent) => this._handleMouseDown(event, elementToHandle));
        elementToHandle.addEventListener("mouseup", (event: MouseEvent) => this._handleMouseUp(event, elementToHandle));
        elementToHandle.addEventListener("mousemove", (event: MouseEvent) => this._handleMouseMove(event, elementToHandle));
    }

    private _fire(type: EventType, event: MouseEvent, element: HTMLElement) {
        switch(type) {
            case EventType.click: this._mouseClickHandler.call(this._handler, event, element); return;
            case EventType.doubleClick: this._mouseDoubleClickHandler.call(this._handler, event, element); return;
            case EventType.up: this._mouseUpHandler.call(this._handler, event, element); return;
            case EventType.down: this._mouseDownHandler.call(this._handler, event, element); return;
            case EventType.move: this._mouseMoveHandler.call(this._handler, event, element); return;
            default: assertUnreachable(type);
        }
    }

    private _handleMouseDown(event: MouseEvent, element: HTMLElement) {
        this._downMousePostion = element.getLocalCords(event);
        this._fire(EventType.down, event, element);
    }

    private _handleMouseUp(event: MouseEvent, element: HTMLElement) {
        this._fire(EventType.up, event, element);

        const coords = element.getLocalCords(event);
        if (coords[0].isWithingRange(this._downMousePostion[0], mouseEventsHandler.acceptableRange) 
            && coords[1].isWithingRange(this._downMousePostion[1], mouseEventsHandler.acceptableRange)) {

            this._fire(EventType.click, event, element);
            if (Date.now() - this._sinceLastClick < 200)
                this._fire(EventType.doubleClick, event, element);

            this._sinceLastClick = Date.now();
        }
    }

    private _handleMouseMove(event: MouseEvent, element: HTMLElement) {
        this._fire(EventType.move, event, element);
    }
}