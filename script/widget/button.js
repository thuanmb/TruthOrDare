/**
*
* Present the button
*/
function Button () {}

Button.inheritsFrom(View);
Button.HTML = 	'<div id="{0}" class="{1}">' +
				'</div>';
Button.DEFAULT_DELAY_TIME = 200;

/**
* Init button
*/
Button.prototype.init = function(id, styleClass, callback, delayTime) {
	Button.prototype.super.init.call(this, id);

	this.setCallback(callback);
	if (delayTime != null) {
		this._delayTime = delayTime;
	} else {
		this._delayTime = Button.DEFAULT_DELAY_TIME;
	}

	var html = Button.HTML.format(id, styleClass);
	var jquery = $(html);
	this.setView(jquery);
	this.setClick();
	
	delete jquery;
	return this;
};


/**
*
* Set callback
*/
Button.prototype.setCallback = function (callback) {
	this._callback = callback;
};

/**
*
* Set click event
*/
Button.prototype.setClick = function () {
	this.enable();
	this.getView().click(this.onClick.bind(this));
};

/**
*
* Handle click event
*/
Button.prototype.onClick = function () {
	if (this.isDisabled() == false) {
		Util.exec(this._callback);

		this.disbleViewInPeriod(this._delayTime);
	}
};

/**
*
* Present the image button
*/
function ImageButton () {}

ImageButton.inheritsFrom(Button);

ImageButton.HTML = '<img src="{0}"></img>';

ImageButton.prototype.init = function(id, styleClass, imgUp, imgDown, 
									isUpImageAfterClick, callback, delayTime) {
	ImageButton.prototype.super.init.call(this, id, styleClass, callback, delayTime);

	this._imgUp = imgUp;
	this._imgDown = imgDown;
	this._isUpImageAfterClick = isUpImageAfterClick;

	var html = ImageButton.HTML.format(imgUp);
	var jquery = $(html);
	this._image = jquery;

	this.getView().append(jquery);
	delete jquery;
	return this;
};

/**
*
* Handle click event
*/
ImageButton.prototype.onClick = function () {
	if (this._isUpImageAfterClick) {
		this.setImage(this._imgUp);
	}
	else {
		this.setImage(this._imgDown);	
	}

	// Call the super click handler
	ImageButton.prototype.super.onClick.call(this);
	
};

/**
* reset Image button
*/
ImageButton.prototype.reset = function () {
	this.setImage(this._imgUp);
};

/**
*
* Change image
*/
ImageButton.prototype.changeImage = function (imgUp, imgDown) {
	if (imgDown === undefined) {
		imgDown = imgUp;
	}

	if(this._image.src == this._imgUp) {
		this.setImage(imgUp);
	}
	else {
		this.setImage(imgDown);	
	}

	this._imgUp = imgUp;
	this._imgDown = imgDown;
};

/**
* Change source image button
*/
ImageButton.prototype.setImage = function (src) {
	this._image.attr("src", src);
}

/**
*
* Present the text button
*/
function TextButton () {}

TextButton.inheritsFrom(Button);

TextButton.HTML = '<span>{0}</span>';

TextButton.prototype.init = function(id, styleClass, text, classNameUp, classNameDown, 
									isUpAfterClick, callback, delayTime) {
	TextButton.prototype.super.init.call(this, id, "text-button " + styleClass, callback, delayTime);

	this._classNameUp = classNameUp;
	this._classNameDown = classNameDown;
	this._isUpAfterClick = isUpAfterClick;

	var html = TextButton.HTML.format(text);
	var jquery = $(html);
	this._textJquery = jquery;

	this.getView().append(jquery);
	
	delete jquery;
	return this;
};

/**
* Handle event click
*/
TextButton.prototype.onClick = function () {
	if (this._isUpIAfterClick) {
		this.up();
	}
	else {
		this.down();
	}

	// Call the super click handler
	TextButton.prototype.super.onClick.call(this);
};

/**
* Reset text button
*/
TextButton.prototype.reset = function () {
	this.up();
};

/**
* Event up
*/
TextButton.prototype.up = function () {
	this.getView().removeClass(this._classNameDown);
	this.getView().addClass(this._classNameUp);
};

/**
* Event down
*/
TextButton.prototype.down = function () {
	this.getView().removeClass(this._classNameUp);
	this.getView().addClass(this._classNameDown);
};

/**
* Change imageof Textbutton
*/
TextButton.prototype.changeImage = function (classNameUp, classNameDown) {
	if(this.hasClass(this._classNameUp)) {
		this.up();
	}
	else {
		this.down();
	}

	this._classNameUp = classNameUp;
	this._classNameDown = classNameDown;
};

/**
* Change text of Textbutton
*/
TextButton.prototype.setText = function (text) {
	this._textJquery.html(text);
}

/**
*
* Present the image text button
*/
function ImageTextButton () {}

ImageTextButton.inheritsFrom(ImageButton);

ImageTextButton.HTML = '<span>{0}</span>';

ImageTextButton.prototype.init = function(id, styleClass, imgUp, imgDown, text, classNameUp, classNameDown,
									isUpAfterClick, callback, delayTime) {
	ImageTextButton.prototype.super.init.call(this, id, "text-button " + styleClass, imgUp, imgDown, 
									isUpAfterClick, callback, delayTime);

	this._classNameUp = classNameUp;
	this._classNameDown = classNameDown;

	var html = ImageTextButton.HTML.format(text);
	var jquery = $(html);
	this._textJquery = jquery;

	this.getView().append(jquery);
	
	delete jquery;
	return this;
};

/**
*
* Handle click event
*/
ImageTextButton.prototype.onClick = function () {
	if (this._isUpImageAfterClick === true) {
		this.up();
	}
	else {
		this.down();
	}

	// Call the super click handler
	ImageTextButton.prototype.super.onClick.call(this);
};

/**
* Reset the Image text button
*/
ImageTextButton.prototype.reset = function () {
	this.up();

	ImageTextButton.prototype.super.reset.call(this);
};

/**
* Event up
*/
ImageTextButton.prototype.up = function () {
	this.getView().removeClass(this._classNameDown);
	this.getView().addClass(this._classNameUp);
};

/**
* Event down
*/
ImageTextButton.prototype.down = function () {
	this.getView().removeClass(this._classNameUp);
	this.getView().addClass(this._classNameDown);
};

/**
* Handle event change class name
*/
ImageTextButton.prototype.changeClassName = function (classNameUp, classNameDown) {
	if(this.hasClass(this._classNameUp)) {
		this.up();
	}
	else {
		this.down();
	}

	this._classNameUp = classNameUp;
	this._classNameDown = classNameDown;

	ImageTextButton.prototype.super.changeImage.call(this);
};

/**
* Chang text of Imagetextbutton
*/
ImageTextButton.prototype.setText = function (text) {
	this._textJquery.html(text);
}