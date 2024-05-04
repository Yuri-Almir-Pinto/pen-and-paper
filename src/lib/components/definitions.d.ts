import Konva from "konva";



declare global {
    type ActionType = "Line"
    
    type InteractionType = "DrawLine"
    
    type Coords = [number, number];
    
    interface ActionData {
        actionType: ActionType
        path: number[]
        origin: Coords
        width: number
        color: number
    }
    
    interface OptionalActionData {
        actionType?: ActionType
        path?: number[]
        origin?: Coords
        width?: number
        color?: number
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
  
