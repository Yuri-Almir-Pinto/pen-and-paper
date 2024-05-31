import Konva from "konva";
import type { Drawing } from "./canvas/Drawing";

declare global {
    type ActionType = "Line" | "Square" | "Circle"
    
    type InteractionType = "DrawLine" | "DrawSquare" | "DrawCircle" | "Move"
    
    type Coords = [number, number];
    
    interface LineData {
        origin: Coords
        strokeWidth: number
        strokeColor: number | string
    }

    interface SquareData {
        origin: Coords
        width: number
        height: number
        fillColor: number | string
        strokeColor: number | string
        strokeWidth: number
        cornerRadius: number
    }

    interface CircleData {
        origin: Coords
        width: number
        height: number
        fillColor: number | string
        strokeColor: number | string
        strokeWidth: number
    }

    interface Size {
        width: number,
        height: number,
    }

    type UndoFunction = () => boolean

    type UndoStack = Map<UndoFunction, boolean>
    
    type SparseArray<T> = (T | undefined)[];
    
    interface IEventHandlers {
        mouseDownHandler: CustomMouseEventHandler
        mouseUpHandler: CustomMouseEventHandler
        mouseClickHandler: CustomMouseEventHandler
        mouseDoubleClickHandler: CustomMouseEventHandler
        mouseMoveHandler: CustomMouseEventHandler
        keydownHandler: CustomKeyboardEventHandler
        keyUpHandler: CustomKeyboardEventHandler
        wheelHandler: CustomWheelEventHandler
    }
    
    type CustomMouseEventHandler = (event: MouseEvent) => void
    type CustomKeyboardEventHandler = (event: KeyboardEvent) => void
    type CustomWheelEventHandler = (event: WheelEvent) => void

    interface HTMLElement {
        getLocalCords: (coords: MouseEvent) => TYPES.Coords;
    }

    interface Number {
        isWithingRange: (compareTo: number, range: number) => boolean
    }

    interface Array<T> {
        toVector2d: (this: number[]) => {x: number, y: number}[]
    }

    interface SVGElement {
        PenAndPaper: Drawing
    }
}
  
