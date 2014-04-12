/**
* Callback class
*/

function Callback() { }

Callback.prototype.init = function (callbackFunc, callee, args) {
    this._callbackFunc = callbackFunc;

    if (args == null) {
        if (typeof callee == Array) {
            this._callee = null;
            this._args = callee;
        } else {
            this._callee = callee;
            this._args = null;
        }
    }
    else {
        this._callee = callee;
        this._args = args;
    }

    return this;
};

Callback.prototype.perform = function (overrideArgs) {
    var localArgs = this._args;

    if (overrideArgs != null) {
        localArgs = overrideArgs;
    }

    if (localArgs != null && Object.prototype.toString.call( localArgs ) === '[object Array]') {
        this._callbackFunc.apply(this._callee, localArgs);
    }
    else {
        this._callbackFunc.call(this._callee, localArgs);
    }
};
