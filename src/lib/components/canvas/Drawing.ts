import Konva from "konva";
import { assertUnreachable } from "../utils/general";

export class Drawing {
    static ns: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg"

    private _actionType: ActionType = "Line"
    private _path: number[] = []
    private _origin: Coords = [0, 0]
    private _height: number = 0
    private _width: number = 0
    private _strokeWidth: number = 0
    private _strokeColor: string = ""
    private _fillColor: string = ""
    private _cornerRadius: number = 0
    private _object: SVGElement
    private _undoStack: UndoStack = new Map()
    private _tempFinalPath?: Coords

    constructor(SVG: SVGElement) {
        this._object = SVG;
    }

    commit({ includeTempFinalPath = false } = {}): UndoStack {
        const actionType = this._actionType;

        switch(actionType) {
            case "Line":
                if (includeTempFinalPath && this._tempFinalPath != undefined)
                    this._object.setAttribute("d", `${this._toSVGPath("M", this._origin)}${this._toSVGPath("L", this._path)}${this._toSVGPath("L", this._tempFinalPath)}`);
                else
                    this._object.setAttribute("d", `${this._toSVGPath("M", this._origin)}${this._toSVGPath("L", this._path)}`);
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
        const action = new Drawing(document.createElementNS(Drawing.ns, "path"));

        action._actionType = "Line";
        action._path = path;
        action._origin = origin;
        action._strokeWidth = strokeWidth;
        action._strokeColor = typeof strokeColor === "number" ? `#${strokeColor.toString(16)}` : strokeColor;

        const drawing = action._object;
        drawing.setAttribute("stroke", action._strokeColor);
        drawing.setAttribute("stroke-width", action._strokeWidth.toString());
        drawing.setAttribute("fill", "none");
        drawing.setAttribute("d", `M${action._origin[0]} ${action._origin[1]} ${action._toSVGPath("L", action._path)}`)
        drawing.PenAndPaper = action;

        action._object = drawing;

        return action;
    }

    static newSquare({ origin, width, height, fillColor, strokeColor, strokeWidth, cornerRadius }: SquareData): Drawing {
        const action = new Drawing(document.createElementNS(Drawing.ns, "rect"));

        action._actionType = "Square";
        action._origin = origin;
        action._width = width;
        action._height = height;
        action._strokeWidth = strokeWidth;
        action._strokeColor = typeof strokeColor === "number" ? `#${strokeColor.toString(16)}` : strokeColor;
        action._fillColor = typeof fillColor === "number" ? `#${fillColor.toString(16)}` : fillColor;
        action._cornerRadius = cornerRadius;

        const drawing = action._object;
        drawing.setAttribute("stroke", action._strokeColor);
        drawing.setAttribute("stroke-width", action._strokeWidth.toString());
        drawing.setAttribute("fill", action._fillColor);
        drawing.setAttribute("x", action._origin[0].toString());
        drawing.setAttribute("y", action._origin[1].toString());
        drawing.setAttribute("rx", action._cornerRadius.toString());
        drawing.setAttribute("ry", action._cornerRadius.toString());
        drawing.setAttribute("width", Math.abs(action._width).toString());
        drawing.setAttribute("height", Math.abs(action._height).toString());
        drawing.PenAndPaper = action;

        action._object = drawing;

        return action;
    }

    static newCircle({ origin, width, height, fillColor, strokeColor, strokeWidth }: CircleData): Drawing {
        const action = new Drawing(document.createElementNS(Drawing.ns, "ellipse"));

        action._actionType = "Circle";
        action._origin = origin;
        action._width = width;
        action._height = height;
        action._strokeWidth = strokeWidth;
        action._strokeColor = typeof strokeColor === "number" ? `#${strokeColor.toString(16)}` : strokeColor;
        action._fillColor = typeof fillColor === "number" ? `#${fillColor.toString(16)}` : fillColor;

        const drawing = action._object;
        drawing.setAttribute("stroke", action._strokeColor);
        drawing.setAttribute("stroke-width", action._strokeWidth.toString());
        drawing.setAttribute("fill", action._fillColor);
        drawing.setAttribute("cx", action._origin[0].toString());
        drawing.setAttribute("cy", action._origin[1].toString());
        drawing.setAttribute("rx", Math.abs(action._width / 2).toString());
        drawing.setAttribute("ry", Math.abs(action._height / 2).toString());
        drawing.PenAndPaper = action;

        action._object = drawing;

        return action;
    }

    private _toSVGPath(action: string, path: number[]): string {
        if (path.length % 2 !== 0)
            return "";

        let returnString = "";

        for (let i = 0; i < path.length; i++) {
            if (i % 2 === 0)
                returnString += `${action}${path[i]} `
            else
                returnString += `${path[i]} `
        }

        return returnString;
    }

    getActionType(): ActionType {
        return this._actionType;
    }
    getPath(): number[] {
        return this._path;
    }
    getOrigin(): number[] {
        return this._origin;
    }
    getHeight(): number {
        return this._height;
    }
    getWidth(): number {
        return this._width;
    }
    getStrokeWidth(): number {
        return this._strokeWidth;
    }
    getStrokeColor(): string {
        return this._strokeColor;
    }
    getCornerRadius(): number {
        return this._cornerRadius;
    }
    getFillColor(): string {
        return this._fillColor;
    }
    getObject(): SVGElement {
        return this._object
    }

    setPath(value: number[]) {
        const actionType = this._actionType;
        this._path = [...value];

        switch(actionType) {
            case "Line":
                this._object.setAttribute("d", `${this._toSVGPath("M", this._origin)}${this._toSVGPath("L", this._path)}`);
                break;
            case "Square":
                break;
            case "Circle":
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    setOrigin(value: Coords) {
        const actionType = this._actionType;
        this._origin = value;

        switch(actionType) {
            case "Line":
                this._object.setAttribute("d", `${this._toSVGPath("M", this._origin)}${this._toSVGPath("L", this._path)}`);
                break;
            case "Square":
                this._object.setAttribute("x", this._origin[0].toString());
                this._object.setAttribute("y", this._origin[1].toString());
                break;
            case "Circle":
                this._object.setAttribute("cx", this._origin[0].toString());
                this._object.setAttribute("cy", this._origin[1].toString());
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    setSize({width, height}: Size) {
        const actionType = this._actionType;
        this._width = width;
        this._height = height;

        switch(actionType) {
            case "Line":
                break;
            case "Square":
                this._object.setAttribute("width", Math.abs(this._width === 0 ? 1 : this._width).toString());
                this._object.setAttribute("height", Math.abs(this._height === 0 ? 1 : this._height).toString());
                let x = this._width > 0 ? this._origin[0] : this.getXMousePos();
                let y = this._height > 0 ? this._origin[1] : this.getYMousePos();
                
                this._object.setAttribute("x", x.toString());
                this._object.setAttribute("y", y.toString());
                break;
            case "Circle":
                this._object.setAttribute("rx", Math.abs(this._width/2 === 0 ? 1 : this._width/2).toString());
                this._object.setAttribute("ry", Math.abs(this._height/2 === 0 ? 1 : this._height/2).toString());
                const xPos = this._width > 0 ? this._origin[0] + this._width / 2 : this.getXMousePos() - this._width / 2;
                const yPos = this._height > 0 ? this._origin[1] + this._height / 2 : this.getYMousePos() - this._height / 2;
                
                this._object.setAttribute("cx", xPos.toString());
                this._object.setAttribute("cy", yPos.toString());
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    setStrokeWidth(value: number) {
        const actionType = this._actionType;
        this._strokeWidth = value;

        switch(actionType) {
            case "Line":
            case "Square":
            case "Circle":
                this._object.setAttribute("stroke-width", this._strokeWidth.toString());
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    setStrokeColor(value: number | string) {
        const actionType = this._actionType;
        this._strokeColor = typeof value === "number" ? `#${value.toString(16)}` : value;

        switch(actionType) {
            case "Line":
            case "Square":
            case "Circle":
                this._object.setAttribute("stroke", this._strokeColor);
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    setCornerRadius(value: number) {
        const actionType = this._actionType;
        this._cornerRadius = value;

        switch(actionType) {
            case "Line":
                break;
            case "Square":
                this._object.setAttribute("rx", this._cornerRadius.toString());
                this._object.setAttribute("ry", this._cornerRadius.toString());
                break;
            case "Circle":
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    setFillColor(value: number | string) {
        const actionType = this._actionType;
        this._fillColor = typeof value === "number" ? `#${value.toString(16)}` : value;

        switch(actionType) {
            case "Line":
                break;
            case "Square":
            case "Circle":
                this._object.setAttribute("fill", this._fillColor);
                break;
            default:
                assertUnreachable(actionType);
        }
    }
    setTempFinalPath(value: Coords) {
        const actionType = this._actionType;
        this._tempFinalPath = value;

        switch(actionType) {
            case "Line":
                this._object.setAttribute("d", `${this._toSVGPath("M", this._origin)}${this._toSVGPath("L", this._path)}${this._toSVGPath("L", this._tempFinalPath)}`);
                break;
            case "Square":
                break;
            case "Circle":
                break;
            default:
                assertUnreachable(actionType);
        }
    }

    getXMousePos() {
        return this._origin[0] + this._width;
    }
    getYMousePos() {
        return this._origin[1] + this._height;
    }


}