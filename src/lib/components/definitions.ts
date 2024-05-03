export enum ActionType {
    Line,
};

export enum InteractionType {
    DrawLine,
}

export type Coords = [number, number];

export interface ActionData {
    actionType: ActionType
    path: Coords[]
    origin: Coords
    width: number
    color: number
}

export interface OptionalActionData {
    actionType?: ActionType
    path?: Coords[]
    origin?: Coords
    width?: number
    color?: number
}

export type SparseArray<T> = (T | undefined)[];

export interface IMouseEvents {
    mouseDownHandler: CustomMouseEventHandler,
    mouseUpHandler: CustomMouseEventHandler,
    mouseClickHandler: CustomMouseEventHandler,
    mouseDoubleClickHandler: CustomMouseEventHandler,
    mouseMoveHandler: CustomMouseEventHandler
}

export type CustomMouseEventHandler = (event: MouseEvent, element: HTMLElement) => void