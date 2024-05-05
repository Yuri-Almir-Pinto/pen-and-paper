import Konva from "konva";
import * as ACTION from "./Action";

export class ActionCollection {
    private _actions: SparseArray<ACTION.Action>
    private _layer: Konva.Layer;
    private _currentlyDrawing?: ACTION.Action

    constructor(layer: Konva.Layer, actions?: ACTION.Action[]) {
        this._actions = actions != null ? actions : [];
        this._layer = layer;
    }

    discardCurrentFinalPath() {
        this._currentlyDrawing?.emptyTempFinalPath();
    }

    addCurrentDrawing(action: ACTION.Action) {
        this._currentlyDrawing = action;
        this.draw(action);
    }

    progressCurrentDrawing(progressFunc: (action: ACTION.Action) => void) {
        if (this._currentlyDrawing == null) { 
            console.error("_currentDrawing was null when progressing."); 
            return; 
        }
            
        progressFunc(this._currentlyDrawing);

        this.refresh();
    }

    commitCurrentDrawing() {
        this._currentlyDrawing?.commit();
        this.addAction(this._currentlyDrawing)
        this._currentlyDrawing = undefined;
    }

    // Adiciona ação no layer, na lista, e desenha ela.
    addAction(...actions: SparseArray<ACTION.Action>) {
        actions.forEach((action) => action?.commit());

        this._actions.push(...actions);

        this.draw(...actions);
    }

    // Remove a ação do layer, da lista, e deixa de desenhar ela.
    removeAction(...actions: SparseArray<ACTION.Action>) {
        this._layer.removeChildren();
        for (let i = 0; i < actions.length; i++) {
            if (actions[i] != undefined)
                this._actions = this._actions.filter((element) => element !== actions[i]);
        }
        
        this.draw(...this._actions);
    }

    // Desenha a ação no layer.
    draw(...actions: SparseArray<ACTION.Action>) {
        if (actions.length === 1)
            if (actions[0] != undefined)
                this._layer.add(actions[0].object);
        else {
            const objects: Konva.Shape[] = [];
            for (let i = 0; i < actions.length; i++) {
                const action = actions[i];
                if (action != undefined)
                    objects.push(action.object);
            }

            this._layer.add(...objects);
        }

        this.refresh();
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