import Konva from "konva";



declare global {
    type ActionType = "Line" | "Square"
    
    type InteractionType = "DrawLine" | "DrawSquare"
    
    type Coords = [number, number];
    
    interface LineData {
        path: number[]
        origin: Coords
        strokeWidth: number
        strokeColor: number
    }

    interface SquareData {
        x: number
        y: number
        width: number
        height: number
        fillColor: number
        strokeColor: number
        strokeWidth: number
        cornerRadius: number
        transparent: boolean
    }

    interface Size {
        width: number,
        height: number,
    }
    
    type SparseArray<T> = (T | undefined)[];
    
    interface IMouseEvents {
        mouseDownHandler: CustomMouseEventHandler,
        mouseUpHandler: CustomMouseEventHandler,
        mouseClickHandler: CustomMouseEventHandler,
        mouseDoubleClickHandler: CustomMouseEventHandler,
        mouseMoveHandler: CustomMouseEventHandler
        keydownHandler: CustomKeyboardEventHandler
    }
    
    type CustomMouseEventHandler = (event: Konva.KonvaEventObject<MouseEvent>) => void
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
}
  
