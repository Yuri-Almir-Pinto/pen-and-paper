import Konva from "konva";
import { assertUnreachable } from "../utils/general";

export class Action {
    private _actionType: ActionType;
    private _path: number[]
    private _origin: Coords
    private _tempFinalPath?: Coords
    private _width: number
    private _color: number
    private _object: Konva.Shape

    constructor(data: ActionData) {
        let { width, color, origin, path, actionType } = data;

        this._path = path;
        this._origin = origin;
        this._actionType = actionType;
        this._width = width;
        this._color = color;

        this._object = this._create(data);
    }

    commit() {
        if (this._tempFinalPath != undefined)
            this._path = [...this._path, ...this._tempFinalPath];
    }

    private _create({ width, color, origin, path, actionType }: ActionData): Konva.Shape {
        switch(actionType) {
            case "Line":
                return new Konva.Line({
                    points: [...origin, ...path],
                    stroke: color.toString(16),
                    strokeWidth: width,
                    lineCap: 'round',
                    lineJoin: 'round',
                });
            default:
                assertUnreachable(actionType);
        }
    }

    get get_actionType(): ActionType {
        return this._actionType;
    }
    get path(): number[] {
        return this._path;
    }
    get origin(): number[] {
        return this._origin;
    }
    get width(): number {
        return this._width;
    }
    get color(): number {
        return this._color;
    }
    get object(): Konva.Shape {
        return this._object
    }

    set path(value: number[]) {
        this._path = [...value];
        switch(this._actionType) {
            case "Line":
                (this._object as Konva.Line).points([...this._origin, ...value]);
                break;
        }
    }
    set origin(value: Coords) {
        this._origin = value;
        switch(this._actionType) {
            case "Line":
                (this._object as Konva.Line).points([...value, ...this._path]);
                break;
        }
    }
    set width(value: number) {
        this._width = value;
        switch(this._actionType) {
            case "Line":
                (this._object as Konva.Line).width(this._width);
                break;
        }
    }
    set color(value: number) {
        this._color = value;
        switch(this._actionType) {
            case "Line":
                (this._object as Konva.Line).colorKey = value.toString(16);
                break;
        }
    }
    set tempFinalPath(value: Coords) {
        this._tempFinalPath = value;
        switch(this._actionType) {
            case "Line":
                (this._object as Konva.Line).points([...this._origin, ...this._path, ...this._tempFinalPath])
        }
    }
}