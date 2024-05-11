import Konva from "konva";
import { assertUnreachable } from "../utils/general";

export class Drawing {
    private _actionType: ActionType = "Line";
    private _path: number[] = []
    private _origin: Coords = [0, 0]
    private _height: number = 0
    private _width: number = 0
    private _strokeWidth: number = 0
    private _strokeColor: number = 0
    private _fillColor: number = 0
    private _cornerRadius: number = 0
    private _object: Konva.Shape = new Konva.Line()
    private _transparentFill: boolean = false
    private _undoStack: UndoStack = new Map()
    private _tempFinalPath?: Coords

    commit({ includeTempFinalPath = false } = {}): UndoStack {
        const actionType = this._actionType;

        switch(actionType) {
            case "Line":
                if (includeTempFinalPath && this._tempFinalPath != undefined)
                    (this._object as Konva.Line).points([...this._origin, ...this._path, ...this._tempFinalPath])
                else
                    (this._object as Konva.Line).points([...this._origin, ...this._path])
                break;
            case "Square":
                break;
            case "Circle":
                break;
            default:
                assertUnreachable(actionType);
        }

        this._tempFinalPath = undefined;
        return this._undoStack;
    }

    static newLine({ strokeWidth, strokeColor, origin, path }: LineData): Drawing {
        const action = new Drawing();

        action._actionType = "Line";
        action._path = path;
        action._origin = origin;
        action._strokeWidth = strokeWidth;
        action._strokeColor = strokeColor;

        action._object = new Konva.Line({
            points: [...origin, ...path],
            stroke: `#${strokeColor.toString(16)}`,
            strokeWidth: strokeWidth,
            lineCap: 'round',
            lineJoin: 'round',
        });

        action._object.shadowForStrokeEnabled(false);
        action._object.perfectDrawEnabled(false);

        return action;
    }

    static newSquare({ x, y, width, height, fillColor, strokeColor, strokeWidth, cornerRadius, transparent }: SquareData): Drawing {
        const action = new Drawing();

        action._actionType = "Square";
        action._origin = [x, y];
        action._width = width;
        action._height = height;
        action._strokeWidth = strokeWidth;
        action._strokeColor = strokeColor;
        action._fillColor = fillColor;
        action._cornerRadius = cornerRadius;
        action._transparentFill = transparent;

        action._object = new Konva.Rect({
            x: action._origin[0],
            y: action._origin[1],
            height: Math.abs(action._height),
            width: Math.abs(action._width),
            strokeWidth: action._strokeWidth,
            stroke: `#${action._strokeColor.toString(16)}`,
            fill: action._getFillColor(),
            cornerRadius: action._cornerRadius
        });

        action._object.shadowForStrokeEnabled(false);
        action._object.perfectDrawEnabled(false);

        return action;
    }

    static newCircle({ x, y, width, height, fillColor, strokeColor, strokeWidth, transparent }: CircleData): Drawing {
        const action = new Drawing();

        action._actionType = "Circle";
        action._origin = [x, y];
        action._width = width;
        action._height = height;
        action._strokeWidth = strokeWidth;
        action._strokeColor = strokeColor;
        action._fillColor = fillColor;
        action._transparentFill = transparent;

        action._object = new Konva.Ellipse({
            x: action._origin[0] + Math.abs(action._height / 2),
            y: action._origin[1] + Math.abs(action._width / 2),
            radiusY: Math.abs(action._height) / 2,
            radiusX: Math.abs(action._width) / 2,
            strokeWidth: action._strokeWidth,
            stroke: `#${action._strokeColor.toString(16)}`,
            fill: action._getFillColor(),
        });

        action._object.shadowForStrokeEnabled(false);
        action._object.perfectDrawEnabled(false);

        return action;
    }

    private _getFillColor() {
        return this._transparentFill ? `#${this._fillColor.toString(16)}` : "transparent";
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
    get height(): number {
        return this._height;
    }
    get width(): number {
        return this._width;
    }
    get strokeWidth(): number {
        return this._strokeWidth;
    }
    get strokeColor(): number {
        return this._strokeColor;
    }
    get cornerRadius(): number {
        return this._cornerRadius;
    }
    get fillColor(): string {
        return this._getFillColor();
    }
    get object(): Konva.Shape {
        return this._object
    }

    set path(value: number[]) {
        const actionType = this._actionType;
        this._path = [...value];

        switch(actionType) {
            case "Line":
                (this._object as Konva.Line).points([...this._origin, ...value]);
                break;
            case "Square":
                break;
            case "Circle":
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    set origin(value: Coords) {
        const actionType = this._actionType;
        this._origin = value;

        switch(actionType) {
            case "Line":
                (this._object as Konva.Line).points([...this._origin, ...this._path]);
                break;
            case "Square":
                (this._object as Konva.Rect).position({
                    x: this._origin[0],
                    y: this._origin[1]
                });
                break;
            case "Circle":
                (this._object as Konva.Circle).position({
                    x: this._origin[0],
                    y: this._origin[1]
                });
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    size({width, height}: Size) {
        const actionType = this._actionType;
        this._width = width;
        this._height = height;

        switch(actionType) {
            case "Line":
                break;
            case "Square":
                (this._object as Konva.Rect).width(Math.abs(this._width));
                (this._object as Konva.Rect).height(Math.abs(this._height));
                (this._object as Konva.Rect).position({
                    x: this._width > 0 ? this._origin[0] : this.xMousePos,
                    y: this._height > 0 ? this._origin[1] : this.yMousePos
                });
                break;
            case "Circle":
                (this._object as Konva.Ellipse).radiusX(Math.abs(this._width) / 2);
                (this._object as Konva.Ellipse).radiusY(Math.abs(this._height) / 2);
                (this._object as Konva.Rect).position({
                    x: this._width > 0 ? this._origin[0] + this._width / 2 : this.xMousePos - this._width / 2,
                    y: this._height > 0 ? this._origin[1] + this._height / 2 : this.yMousePos - this._height / 2
                });
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    set strokeWidth(value: number) {
        const actionType = this._actionType;
        this._strokeWidth = value;

        switch(actionType) {
            case "Line":
                (this._object as Konva.Line).width(this._strokeWidth);
                break;
            case "Square":
                (this._object as Konva.Rect).strokeWidth(this._strokeWidth);
                break;
            case "Circle":
                (this._object as Konva.Circle).strokeWidth(this._strokeWidth);
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    set strokeColor(value: number) {
        const actionType = this._actionType;
        this._strokeColor = value;
        const color = `#${this._strokeColor.toString(16)}`;

        switch(actionType) {
            case "Line":
                (this._object as Konva.Line).stroke(color);
                break;
            case "Square":
                (this._object as Konva.Rect).stroke(color);
                break;
            case "Circle":
                (this._object as Konva.Circle).stroke(color);
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    set cornerRadius(value: number) {
        const actionType = this._actionType;
        this._cornerRadius = value;

        switch(actionType) {
            case "Line":
                break;
            case "Square":
                (this._object as Konva.Rect).cornerRadius(this._cornerRadius);
                break;
            case "Circle":
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    set fillColor(value: number) {
        const actionType = this._actionType;
        this._fillColor = value;
        const color = this._getFillColor();

        switch(actionType) {
            case "Line":
                break;
            case "Square":
                (this._object as Konva.Rect).fill(color);
                break;
            case "Circle":
                (this._object as Konva.Circle).fill(color);
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    set tempFinalPath(value: Coords) {
        const actionType = this._actionType;
        this._tempFinalPath = value;

        switch(actionType) {
            case "Line":
                (this._object as Konva.Line).points([...this._origin, ...this._path, ...this._tempFinalPath])
                break;
            case "Square":
                break;
            case "Circle":
                break;
            default:
                assertUnreachable(actionType);
        }
    }

    get xMousePos() {
        return this._origin[0] + this._width;
    }
    get yMousePos() {
        return this._origin[1] + this._height;
    }


}