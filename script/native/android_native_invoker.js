function AndroidNativeInvoker () {
}

AndroidNativeInvoker.inheritsFrom(NativeInvoker);

AndroidNativeInvoker.INTERFACE = "NativeInterface";
NativeInvoker.instance = new AndroidNativeInvoker();

AndroidNativeInvoker.prototype.performInvoke = function(method, args, callback) {
	if (window[AndroidNativeInvoker.INTERFACE][method] != null) {
		window[AndroidNativeInvoker.INTERFACE][method](args);	
	}
};