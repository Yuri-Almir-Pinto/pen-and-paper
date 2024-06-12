import type { BaseSvg } from "./BaseSvg"
import type { SvgCircle } from "./SvgCircle"
import type { SvgPath } from "./SvgPath"
import type { SvgSquare } from "./SvgSquare"

export enum SvgType {
    Square, Circle, Path, Base
}

export interface SvgTypeMap {
    [SvgType.Square]: SvgSquare
    [SvgType.Circle]: SvgCircle
    [SvgType.Path]: SvgPath
    [SvgType.Base]: BaseSvg
}

export interface IsShape {
    is<T extends keyof SvgTypeMap>(type: T): this is SvgTypeMap[T]
}

export enum SelectSvgProps {
    GroupClass = "select-group",
    SelectBoxClass = "select-box",
    SelectBoxStrokeWidth = "2",
    SelectBoxStrokeColor = "cyan",
    SelectBoxFillColor = "none"
}

export interface SelectSvgBoxRect { x: number, y: number, width: number, height: number }