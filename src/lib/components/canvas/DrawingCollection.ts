import Konva from "konva";
import * as DRAWING from "./Drawing";

export class ActionCollection {
    private _actions: SparseArray<DRAWING.Drawing>
    private _layer: Konva.Layer
    private _undoStack: UndoFunction[] = []
    private _currentlyDrawing?: DRAWING.Drawing

    constructor(layer: Konva.Layer, actions?: DRAWING.Drawing[]) {
        this._actions = actions != null ? actions : [];
        this._layer = layer;
    }

    undoAction() {
        const action = this._undoStack.pop();

        if (action == undefined)
            return;

        action();
        console.log(this._undoStack);
    }

    addCurrentDrawing(action: DRAWING.Drawing) {
        this._currentlyDrawing = action;
        this.draw(action);
    }

    progressCurrentDrawing(progressFunc: (action: DRAWING.Drawing) => void) {
        if (this._currentlyDrawing == null) { 
            console.error("_currentDrawing was null when progressing."); 
            return; 
        }
            
        progressFunc(this._currentlyDrawing);
    }

    commitCurrentDrawing({ includeTempFinalPath = false } = {}) {
        this.addAction({ includeTempFinalPath }, this._currentlyDrawing)
        this._currentlyDrawing = undefined;
        console.log(this._undoStack);
    }

    // Adiciona ação no layer, na lista, e desenha ela.
    addAction({ includeTempFinalPath = false } = {}, ...actions: SparseArray<DRAWING.Drawing>) {
        for (let i = 0; i < actions.length; i++) {
            if (actions[i] != undefined) {
                const undoFunctions = actions[i]?.commit({ includeTempFinalPath });

                if (undoFunctions == undefined)
                    break;

                for (let undoFunction of undoFunctions.keys())
                    this._undoStack.push(undoFunction);

                undoFunctions.clear();
            }
        }
        
        this._actions.push(...actions);
        
        this.draw(...actions);
    }

    // Desenha a ação no layer.
    draw(...actions: SparseArray<DRAWING.Drawing>) {
        if (actions.length === 1) {
            if (actions[0] != undefined)
                this._layer.add(actions[0].object);
        }
        else {
            const objects: Konva.Shape[] = [];
            for (let i = 0; i < actions.length; i++) {
                const action = actions[i];
                if (action != undefined)
                    objects.push(action.object);
            }

            this._layer.add(...objects);
        }

    }

    refresh() {
        this._layer.draw();
    }

    clear() {
        this._actions = [];
        this._layer.removeChildren();
        this.refresh();
    }

    get isDrawing() {
        return this._currentlyDrawing != undefined;
    }
}