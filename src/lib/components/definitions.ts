export enum ActionType {
    Line,
};

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