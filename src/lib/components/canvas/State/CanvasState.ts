import { Interaction } from "../Controllers/Types"
import { DrawingCollection } from "../Drawings/DrawingCollection"
import type { CanvasStateDTO } from "./Types"

export default class CanvasState implements CanvasStateDTO {
    collection: DrawingCollection

    currentMode: Interaction
    fillColor: number | string
    strokeColor: number | string
    strokeWidth: number
    roundedCorners: number
    zoom: number
    viewX: number
    viewY: number
    svgWidth: number
    svgHeight: number
    viewWidth: number
    viewHeight: number
    isDrawing: boolean

    constructor(
        svg: SVGElement,
        currentMode: Interaction, 
        fillColor: number | string, 
        strokeColor: number | string, 
        strokeWidth: number, 
        roundedCorners: number,
        zoom: number,
        viewX: number,
        viewY: number,
        svgWidth: number,
        svgHeight: number,
        viewWidth: number,
        viewHeight: number) {
            
        this.collection = new DrawingCollection(svg);

        this.currentMode = currentMode;
        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.roundedCorners = roundedCorners;
        this.zoom = zoom;
        this.viewX = viewX;
        this.viewY = viewY;
        this.svgWidth = svgWidth;
        this.svgHeight = svgHeight;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.isDrawing = this.collection.isDrawing;
    }

    commit(): CanvasStateDTO {
        return Object.freeze({ ...this });
    }

    update(svg: SVGElement) {
        this.svgHeight = svg.parentElement?.clientHeight as number;
        this.svgWidth = svg.parentElement?.clientWidth as number;

        const viewBox = svg.getAttribute("viewBox");

        if (viewBox == null)
            return;

        const splitViewBox = viewBox.split(" ");

        this.viewWidth = parseInt(splitViewBox[2]);
        this.viewHeight = parseInt(splitViewBox[3]);
        this.isDrawing = this.collection.isDrawing;
    }

    private _previous?: Interaction
    toggleMove(value: boolean) {
        if (value === true) {
            this._previous = this.currentMode;
            this.currentMode = Interaction.Move
        }
        else {
            this.currentMode = this._previous!;
            this._previous = undefined;
            
        }
    }

    isMoveToggled() {
        return this._previous != null;
    }

    leftDistancePercentage(svgX: number): number {
        return svgX / this.svgWidth;
    }
    
    topDistancePercentage(svgY: number): number {
        return svgY / this.svgHeight;
    }

    static default(svg: SVGElement): CanvasState {
        return new CanvasState(
            svg,
            Interaction.DrawCircle,
            "none",
            "black",
            2,
            10,
            1,
            0,
            0,
            0,
            0,
            0,
            0
        )
    }
}

