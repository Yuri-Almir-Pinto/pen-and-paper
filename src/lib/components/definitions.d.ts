import Konva from "konva";
import type { Drawing } from "./canvas/Drawing";



declare global {
    type ActionType = "Line" | "Square" | "Circle"
    
    type InteractionType = "DrawLine" | "DrawSquare" | "DrawCircle"
    
    type Coords = [number, number];
    
    interface LineData {
        path: number[]
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
    
    interface IMouseEvents {
        mouseDownHandler: CustomMouseEventHandler,
        mouseUpHandler: CustomMouseEventHandler,
        mouseClickHandler: CustomMouseEventHandler,
        mouseDoubleClickHandler: CustomMouseEventHandler,
        mouseMoveHandler: CustomMouseEventHandler
        keydownHandler: CustomKeyboardEventHandler
    }
    
    type CustomMouseEventHandler = (event: MouseEvent) => void
    type CustomKeyboardEventHandler = (event: KeyboardEvent) => void

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
  
