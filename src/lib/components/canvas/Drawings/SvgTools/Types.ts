import type { SvgCircle } from "./SvgCircle"
import type { SvgPath } from "./SvgPath"
import type { SvgSquare } from "./SvgSquare"


export interface SvgType {
    "square": SvgSquare
    "circle": SvgCircle
    "path": SvgPath
    "never": never
}

export interface IsShape {
    is<T extends keyof SvgType>(type: T): this is SvgType[T]
}