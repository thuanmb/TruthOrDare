/**
* Manage the spin on the screen
*
*/
function SpinWidget () {}
SpinWidget.inheritsFrom(View);

SpinWidget.HTML = 	'<div id="{0}" style="position: absolute; top:{1};' + 
						'left:{2}; width:{3}; height:{4}; background-color:{5};z-index:110"></div>';
SpinWidget.PREFIX_ID =  "spinner";
SpinWidget.prototype.init = function (postfixId, top, left, width, height, backgroundColor,
										spinLength, spinWidth, spinRadius, spinColor, numberLines) {
	var id = SpinWidget.PREFIX_ID + "-" + postfixId;
	SpinWidget.prototype.super.init.call(this, id);

	var html = SpinWidget.HTML.format(id, top, left, width, height, backgroundColor);
	var jquery = $(html);
	this.setView(jquery);

	this._spinLength = spinLength;
	this._spinRadius = spinRadius;

	if (numberLines == undefined || numberLines == null)
	{
		numberLines = 13;
	}

	var opts = {
		lines: numberLines, // The number of lines to draw (use 13)
		length: spinLength, // The length of each line
		width: spinWidth, // The line thickness
		radius: spinRadius, // The radius of the inner circle
		corners: 1, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: spinColor, // #rgb or #rrggbb or array of colors
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage (60)
		shadow: false, // Whether to render a shadow
		hwaccel: false, // Whether to use hardware acceleration
		className: 'spinner spinner' + "-" + postfixId + "-" + "content", // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: 0, // Top position relative to parent in px
		left: 0 // Left position relative to parent in px
	};

	this._spinner = new Spinner(opts).spin(jquery[0]);

	return this;
};

SpinWidget.prototype.show = function () {
	SpinWidget.prototype.super.show.call(this);

	var width = $("body").width();
	var height = $("body").height();
	var spinPosLeft = width / 2 - this._spinLength - this._spinRadius;
	var spinPosTop = height / 2 - this._spinLength - this._spinRadius;
	this._spinner.opts.top = spinPosTop;
	this._spinner.opts.left = spinPosLeft;
	this._spinner.spin(this.getView()[0]);
};

SpinWidget.prototype.hide = function () {
	SpinWidget.prototype.super.hide.call(this);
	this._spinner.stop();
};