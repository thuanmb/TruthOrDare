function NativeListener () {
}

// function evalJS (method, args) {
// 	NativeListener.instance.evalJS(method, args);
// }

NativeListener.instance = new NativeListener();

NativeListener.prototype.init = function (handler) {
	this._handler = handler;
};

NativeListener.prototype.evalJS = function(method, args) {
	
	var fn = null;

	if (this._handler[method] != null) {
		fn = this._handler[method];
	} else if (window[method] != null) {
		fn = window[method];
	}

	Util.exec(fn, args);
};