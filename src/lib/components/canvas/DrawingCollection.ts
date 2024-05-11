import * as DRAWING from "./Drawing";

export class ActionCollection {
    private _actions: SparseArray<DRAWING.Drawing>
    private _element: SVGElement
    private _undoStack: UndoFunction[] = []
    private _currentlyDrawing?: DRAWING.Drawing

    constructor(element: SVGElement, actions?: DRAWING.Drawing[]) {
        this._actions = actions != null ? actions : [];
        this._element = element;
    }

    undoAction() {
        const action = this._undoStack.pop();

        if (action == undefined)
            return;

        action();
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
        for (let action of actions) {
            if (action != null)
                this._element.appendChild(action.getObject())
        }
    }

    clear() {
        this._actions = [];
        this._element.innerHTML = "";
    }

    get isDrawing() {
        return this._currentlyDrawing != undefined;
    }
}