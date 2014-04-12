function NativeInvoker () {
}

NativeInvoker.prototype.invoke = function(methodName, args, callback) {
	this.performInvoke(methodName, args, callback);
};