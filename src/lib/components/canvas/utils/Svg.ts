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
    
    scale(scaleX: number, scaleY: number): this {
        this.svg.setAttribute("transform", `scale(${scaleX}, ${scaleY})`);
        return this;
    }
    fillColor(fillColor: string | number): this {
        this.svg.setAttribute("fill", toColor(fillColor));
        return this;
    }
    strokeColor(strokeColor: string | number): this {
        this.svg.setAttribute("stroke", toColor(strokeColor));
        return this;
    }
    strokeWidth(strokeWidth: number): this {
        this.svg.setAttribute("stroke-width", strokeWidth.toString());
        return this;
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        console.error("Some SVG class called the base SVG 'is'. This should not happen.");
        return type === "never"
    }
}

export class SvgSquare extends BaseSvg implements IsShape  {
    constructor() {
        super("rect");
    }

    origin(x: number, y: number): this {
        this.svg.setAttribute("x", x.toString());
        this.svg.setAttribute("y", y.toString());
        return this;
    }
    size(width: number, height: number, x: number, y: number): this {
        this.svg.setAttribute("width", Math.abs(width === 0 ? 1 : width).toString());
        this.svg.setAttribute("height", Math.abs(height === 0 ? 1 : height).toString());
        x = width > 0 ? x : x + width;
        y = height > 0 ? y : y + width;
        
        this.svg.setAttribute("x", x.toString());
        this.svg.setAttribute("y", y.toString());
        return this;
    }
    borderRadius(radius: number): this {
        this.svg.setAttribute("rx", Math.abs(radius).toString());
        this.svg.setAttribute("ry", Math.abs(radius).toString());
        return this;
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        return type === "square"
    }
}

export class SvgCircle extends BaseSvg implements IsShape  {
    constructor() {
        super("ellipse");
    }

    origin(cx: number, cy: number): this {
        this.svg.setAttribute("cx", cx.toString());
        this.svg.setAttribute("cy", cy.toString());
        return this;
    }
    size(width: number, height: number, cx: number, cy: number): this {
        width = width/2;
        height = height/2;
        this.svg.setAttribute("rx", Math.abs(width === 0 ? 1 : width).toString());
        this.svg.setAttribute("ry", Math.abs(height === 0 ? 1 : height).toString());
        const xPos = width > 0 ? cx + width : (cx + width) - width;
        const yPos = height > 0 ? cy + height : (cy + height) - height;
        
        this.svg.setAttribute("cx", xPos.toString());
        this.svg.setAttribute("cy", yPos.toString());
        return this;
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

    path(path: number[]): this {
        this.svg.setAttribute("d", toPath(path));
        return this;
    }
    is<T extends keyof SvgType>(type: T): this is SvgType[T] {
        return type === "path"
    }
}