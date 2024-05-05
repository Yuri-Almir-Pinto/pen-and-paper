import { assertUnreachable } from "../utils/general";
import Konva from "konva";
import * as GEN from "../utils/general";

enum EventType {
    up, down, click, doubleClick, move, keydown
}



export class CanvasEventsHandler {
    private _mouseDownHandler: CustomMouseEventHandler
    private _mouseUpHandler: CustomMouseEventHandler
    private _mouseClickHandler: CustomMouseEventHandler
    private _mouseDoubleClickHandler: CustomMouseEventHandler
    private _mouseMoveHandler: CustomMouseEventHandler
    private _keydownHandler: CustomKeyboardEventHandler
    private _handler: IMouseEvents
    private _downMousePostion!: Coords
    private _sinceLastDown: number = Date.now()
    private _sinceLastClick: number = Date.now()
    static acceptableRange: number = 25

    constructor(handler: IMouseEvents, app: Konva.Stage) {
        this._handler = handler;
        this._mouseDownHandler = handler.mouseDownHandler;
        this._mouseUpHandler = handler.mouseUpHandler;
        this._mouseClickHandler = handler.mouseClickHandler;
        this._mouseDoubleClickHandler = handler.mouseDoubleClickHandler;
        this._mouseMoveHandler = handler.mouseMoveHandler;
        this._keydownHandler = handler.keydownHandler;

        app.on("pointerdown", (event: Konva.KonvaEventObject<MouseEvent>) => this._handleMouseDown(event));
        app.on("pointerup", (event: Konva.KonvaEventObject<MouseEvent>) => this._handleMouseUp(event));
        app.on("pointermove", (event: Konva.KonvaEventObject<MouseEvent>) => this._handleMouseMove(event));

        const container = app.container();
        container.tabIndex = 1;
        container.focus();
        container.addEventListener("keydown", (event: KeyboardEvent) => this._handleKeyDown(event));
    }

    private _fire(type: EventType, event: Konva.KonvaEventObject<MouseEvent>
                                        | KeyboardEvent
    ) {
        switch(type) {
            case EventType.click: this._mouseClickHandler.call(this._handler, event as Konva.KonvaEventObject<MouseEvent>); return;
            case EventType.doubleClick: this._mouseDoubleClickHandler.call(this._handler, event as Konva.KonvaEventObject<MouseEvent>); return;
            case EventType.up: this._mouseUpHandler.call(this._handler, event as Konva.KonvaEventObject<MouseEvent>); return;
            case EventType.down: this._mouseDownHandler.call(this._handler, event as Konva.KonvaEventObject<MouseEvent>); return;
            case EventType.move: this._mouseMoveHandler.call(this._handler, event as Konva.KonvaEventObject<MouseEvent>); return;
            case EventType.keydown: this._keydownHandler.call(this._handler, event as KeyboardEvent); return;
            default: assertUnreachable(type);
        }
    }

    private _handleMouseDown(event: Konva.KonvaEventObject<MouseEvent>) {
        this._sinceLastDown = Date.now();
        const { evt: { layerX: x, layerY: y }} = event;
        this._downMousePostion = [x, y];
        this._fire(EventType.down, event);
    }

    private _handleMouseUp(event: Konva.KonvaEventObject<MouseEvent>) {
        const { evt: { layerX: x, layerY: y }} = event;
        if (Date.now() - this._sinceLastDown < 100) {

            this._fire(EventType.click, event);

            if (Date.now() - this._sinceLastClick < 200)
                this._fire(EventType.doubleClick, event);

            this._sinceLastClick = Date.now();
        }

        this._fire(EventType.up, event);
    }

    private _handleMouseMove(event: Konva.KonvaEventObject<MouseEvent>) {
        this._fire(EventType.move, event);

    }

    private _handleKeyDown(event: KeyboardEvent) {
        this._fire(EventType.keydown, event);
    }
}