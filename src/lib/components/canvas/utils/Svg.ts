const ns: "http://www.w3.org/2000/svg" = "http://www.w3.org/2000/svg";

function toColor(color: string | number) {
    return typeof color === "number" ? color.toString(16) : color;
}

function toPath(path: number[]): string {
    if (path.length % 2 !== 0 || path.length === 0)
        return "";

    let returnString = `M${path[0]} ${path[1]} `;

    for (let i = 2; i < path.length; i++) {
        if (i % 2 === 0)
            returnString += `L${path[i]} `
        else
            returnString += `${path[i]} `
    }

    returnString += "Z";

    return returnString;
}

interface SvgType {
    "square": SvgSquare
    "circle": SvgCircle
    "path": SvgPath
    "never": never
}

export interface IsShape {
    is<T extends keyof SvgType>(type: T): this is SvgType[T]
}

export class BaseSvg implements IsShape {
    svg: SVGElement

    protected constructor(svgType: "rect" | "ellipse" | "path" | SVGElement) {
        if (typeof svgType === "string")
            this.svg = document.createElementNS(ns, svgType);
        else
            this.svg = svgType;
    }
    
    scale([scaleX, scaleY]: [number, number]): void {
        this.svg.setAttribute("transform", `scale(${scaleX}, ${scaleY})`);
    }
    fillColor(fillColor: string | number): void {
        this.svg.setAttribute("fill", toColor(fillColor));
    }
    strokeColor(strokeColor: string | number): void {
        this.svg.setAttribute("stroke", toColor(strokeColor));
    }
    strokeWidth(strokeWidth: number): void {
        this.svg.setAttribute("stroke-width", strokeWidth.toString());
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        return type === "never"
    }
}

export class SvgSquare extends BaseSvg implements IsShape  {
    constructor() {
        super("rect");
    }

    origin([x, y]: [number, number]): void {
        this.svg.setAttribute("x", x.toString());
        this.svg.setAttribute("y", y.toString());
    }
    size(width: number, height: number): void {
        this.svg.setAttribute("width", width.toString());
        this.svg.setAttribute("height", height.toString());
    }
    borderRadius(radius: number): void {
        this.svg.setAttribute("rx", radius.toString());
        this.svg.setAttribute("ry", radius.toString());
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        return type === "square"
    }
}

export class SvgCircle extends BaseSvg implements IsShape  {
    constructor() {
        super("ellipse");
    }

    origin(x: number, y: number): void {
        this.svg.setAttribute("cx", x.toString());
        this.svg.setAttribute("cy", y.toString());
    }
    size(width: number, height: number): void {
        this.svg.setAttribute("rx", Math.abs(width/2 === 0 ? 1 : width/2).toString());
        this.svg.setAttribute("ry", Math.abs(height/2 === 0 ? 1 : height/2).toString());
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        return type === "circle"
    }
}

export class SvgPath extends BaseSvg implements IsShape {
    constructor() {
        super("path");
        this.fillColor("transparent");
    }

    path(path: number[]): void {
        this.svg.setAttribute("d", toPath(path));
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        return type === "path"
    }
}
