type TFuncSignature<TFunctionParam> = (params: TFunctionParam) => void;

export default class EventDispatcher<TFunctionParam> {
    private _events: TFuncSignature<TFunctionParam>[] = []

    addEvent(func: TFuncSignature<TFunctionParam>): void {
        this._events.push(func);
    }

    removeEvent(func: TFuncSignature<TFunctionParam>): void {
        this._events = this._events.filter(f => f !== func);
    }

    call(params: TFunctionParam): void {
        for (let event of this._events)
            event(params);
    }
}