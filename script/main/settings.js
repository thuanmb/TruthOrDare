// global environment variables
window.isIOS 		= navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false;
window.isAndroid 	= navigator.userAgent.match(/Android/i) ? true : false;
window.isBrowser 	= !(window.isIOS | window.isAndroid); // support iOS and Android this time
window.isTouch 		= 'ontouchstart' in window;

Settings = {};

Settings.ABOUT = {
	DesignedBy: "Thuan Minh Bui",
	PoweredBy: "Nguyen Khanh Tran"
};