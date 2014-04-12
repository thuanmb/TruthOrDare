function ScreenManager () {
}
ScreenManager.inheritsFrom(View);

ScreenManager.DIRECTION_LEFT_TO_RIGHT = "left-right";
ScreenManager.DIRECTION_RIGHT_TO_LEFT = "right-left";
ScreenManager.DIRECTION_TOP_TO_BOTTOM = "top-bottom";
ScreenManager.DIRECTION_BOTTOM_TO_TOP = "bottom-top";

ScreenManager.DIRECTION_MAP = {
	"left-right" : {preAnimation: {top: '0%', left: "-100%"}, firstAnimation: {top: '0%', left: '100%'}, secondAnimation: {top: '0%', left: '0%'}},
	"right-left" : {preAnimation: {top: '0%', left: "100%"}, firstAnimation: {top: '0%', left: '-100%'}, secondAnimation: {top: '0%', left: '0%'}},
	"top-bottom" : {preAnimation: {left: 0, top: "-100%"}, firstAnimation: {left: 0, top: '100%'}, secondAnimation: {left: 0, top: '0%'}},
	"bottom-top" : {preAnimation: {left: 0, top: "100%"}, firstAnimation: {left: 0, top: '-100%'}, secondAnimation: {left: 0, top: '0%'}},
};

ScreenManager.ID = "screen-manager";
ScreenManager.FIRST_SCREEN_ID = "first-screen";
ScreenManager.SECOND_SCREEN_ID = "second-screen";
ScreenManager.NAVIGATION_BAR_ID = "navigation-bar";
ScreenManager.NAVIGATION_BAR_LABEL_ID = "navigation-bar-label";
ScreenManager.NAVIGATION_BAR_BTN_CONTAINER_ID = "navigation-bar-btn-container";
ScreenManager.SCREEN_CONTAINER_ID = "screen-container";
ScreenManager.HTML = 	'<div id="{0}" class="full-screen">' +
							'<div class="{1} shadow"><div class="{2}"></div><div class="navigation-bar-label-container"><span class="{3}"></span></div></div>' +
							'<div class="{4} full-screen fixed-screen">' +
								'<div class="{5} full-screen fixed-screen"></div>' +
								'<div class="{6} full-screen fixed-screen"></div>' +
							'</div>' +
						'</div>';

ScreenManager.TRANSITION_TIME = 1200;

ScreenManager.prototype.init = function (onBackPressed) {
	ScreenManager.prototype.super.init.call(this, ScreenManager.ID);
	var jquery = $(ScreenManager.HTML.format(ScreenManager.ID, ScreenManager.NAVIGATION_BAR_ID,
		ScreenManager.NAVIGATION_BAR_BTN_CONTAINER_ID,
		ScreenManager.NAVIGATION_BAR_LABEL_ID, ScreenManager.SCREEN_CONTAINER_ID,
		ScreenManager.FIRST_SCREEN_ID, ScreenManager.SECOND_SCREEN_ID));
	this.setView(jquery);

	this._onbackPressed = onBackPressed;
	this._screenList = {};
	this._screenMap = [];
	this._jQueryListScreen = [];
	this._jQueryListScreen.push(jquery.find("." + ScreenManager.FIRST_SCREEN_ID));
	this._jQueryListScreen.push(jquery.find("." + ScreenManager.SECOND_SCREEN_ID));
	this._jQueryFirstScreen = 0;
	this._jQuerySecondScreen = 1;

	this._jQueryScreenContainer = jquery.find("." + ScreenManager.SCREEN_CONTAINER_ID);
	this._jQueryNavBar = jquery.find("." + ScreenManager.NAVIGATION_BAR_ID);
	this._jQueryNavBarLabel = jquery.find("." + ScreenManager.NAVIGATION_BAR_LABEL_ID);

	// Init buttons
	var jQueryBtnContainer = jquery.find("." + ScreenManager.NAVIGATION_BAR_BTN_CONTAINER_ID);
	var navBtnClass = "nav-button";
	this._backBtn = new TextButton().init("nav-back-button", 
										navBtnClass, 
										"Back", 
										navBtnClass, navBtnClass, 
										true, this.onBackPress.bind(this));
	jQueryBtnContainer.append(this._backBtn.getView());

	this._doneBtn = new TextButton().init("nav-done-button", 
										navBtnClass, 
										"Done", 
										navBtnClass, navBtnClass, 
										true, this.onDonePress.bind(this));
	jQueryBtnContainer.append(this._doneBtn.getView());
	this._jQueryNavBar.hide();

	return this;
};


ScreenManager.prototype.onBackPress = function () {
	Util.exec(this._backBtnCallback);
	this.backScreen();
};

ScreenManager.prototype.onDonePress = function () {
	Util.exec(this._doneBtnCallback);
};

ScreenManager.prototype.addScreen = function (view) {
	if (view != null && view.getId() != null) {
		this._screenList[view.getId()] = view;
	}

	return this;
};

ScreenManager.prototype.removeScreen = function (view) {
	if (view != null && view.getId() != null) {
		this._screenList[view.getId()] = undefined;
	}

	return this;
};

ScreenManager.prototype.pushScreen = function (id, options) {
	if (this._screenList[id] == null) return;

	MainScreen.getInstance().showSpinner();

	// Set default values
	options =  Util.getDefaultValue(options, {});
	var direction = Util.getDefaultValue(options.direction, ScreenManager.DIRECTION_RIGHT_TO_LEFT);
	var transitionTime = Util.getDefaultValue(options.transitionTime, ScreenManager.TRANSITION_TIME);
	var isBackScreen = Util.getDefaultValue(options.isBackScreen, false);
	var hasDoneBtn = Util.getDefaultValue(options.hasDoneBtn, false);
	var hasBackBtn = Util.getDefaultValue(options.hasBackBtn, false);
	var onShowCallback =Util.getDefaultValue(options.onShowCallback, null);
	this._backBtnCallback = Util.getDefaultValue(options.backBtnCallback, null);
	this._doneBtnCallback = Util.getDefaultValue(options.doneBtnCallback, null);
	this._isOverlayScreen = Util.getDefaultValue(options.isOverlayScreen, false);
	// Get the view
	var currentScreenView = this._screenList[id].getView().clone(true, true);
	this._screenList[id].getView().remove();

	// Hanle view before it show
	Util.exec(this._screenList[id].screenWillShow, currentScreenView);

	// Show the view
	var callback = (function (hasBackBtn, hasDoneBtn, onShowCallback) {
		var hasBackBtnStrongRef = hasBackBtn;
		var hasDoneBtnStrongRef = hasDoneBtn;
		var onShowCallbackStrongRef = onShowCallback;
		return function () {
			this.transitionDidDone(hasBackBtnStrongRef, hasDoneBtnStrongRef, onShowCallbackStrongRef);
		}.bind(this)
	}.bind(this))(hasBackBtn, hasDoneBtn, onShowCallback);

	if (this._screenMap.length > 0) {
		var data = ScreenManager.DIRECTION_MAP[direction];
		this._jQueryListScreen[this._jQuerySecondScreen].empty();
		this._jQueryListScreen[this._jQuerySecondScreen].animate(data.preAnimation, 0);

		this._jQueryListScreen[this._jQuerySecondScreen]
			.append(currentScreenView);

		this._jQueryListScreen[this._jQueryFirstScreen].animate(
			data.firstAnimation, transitionTime, function () {
				this._jQueryListScreen[this._jQueryFirstScreen].empty();
				this.exchangeScreenContainer();
			}.bind(this));
	    this._jQueryListScreen[this._jQuerySecondScreen].animate(
	    	data.secondAnimation, transitionTime, callback);
	} else {
		this._jQueryListScreen[this._jQueryFirstScreen].empty();
		this._jQueryListScreen[this._jQueryFirstScreen]
			.append(currentScreenView);

		this._jQueryListScreen[this._jQuerySecondScreen].animate({left:"100%"}, 10, callback);
	}

	// Set the view
	this._screenList[id].setView(currentScreenView);

    if (!isBackScreen) {
    	this._screenMap.push({screenId: id, options: options});	
    } else {
    	this._screenMap.pop();
    }

    if (hasBackBtn) {
    	this._backBtn.show();
    } else {
    	this._backBtn.hide();
    }

    if (hasDoneBtn) {
    	this._doneBtn.show();
    	this._doneBtn.setCallback(options.doneBtnCallback);
    } else {
    	this._doneBtn.hide();
    }

    if (options.navLabel != null) {
    	this._jQueryNavBarLabel.html(options.navLabel);
    }

	return this;
};

ScreenManager.prototype.backScreen = function (options) {
	console.log("ScreenManager.prototype.transitionDidDone: enter");
	options = Util.getDefaultValue(options, {});
	var direction = Util.getDefaultValue(options.direction,  ScreenManager.DIRECTION_LEFT_TO_RIGHT);

	var previousScreen = null;
	if (this._screenMap.length > 1) {
		previousScreen = this._screenMap[this._screenMap.length - 2];
	} else {
		previousScreenId = null;
		this._jQueryNavBar.hide();
	}

	if (previousScreen != null) {
		options = $.extend(previousScreen.options, {
			isBackScreen: true, 
			direction: direction
		});
		this.pushScreen(previousScreen.screenId, options);
	} else {
		console.log("ScreenManager.prototype.transitionDidDone: close app");
		Util.exec(this._onbackPressed);
	};

	return this;
};

ScreenManager.prototype.exchangeScreenContainer = function () {
	var tmp = this._jQueryFirstScreen;
    this._jQueryFirstScreen = this._jQuerySecondScreen;
    this._jQuerySecondScreen = tmp;
};

ScreenManager.prototype.hideNavBar = function () {
	this._jQueryNavBar.slideUp();
	// this._jQueryScreenContainer.css("height", "100%");
	// this._jQueryScreenContainer.css("top", "0%");
};

ScreenManager.prototype.showNavBar = function () {
	this._jQueryNavBar.slideDown();
	// this._jQueryScreenContainer.css("height", "93%");
	// this._jQueryScreenContainer.css("top", "7%");
};

ScreenManager.prototype.transitionDidDone = function (hasBackBtn, hasDoneBtn, onShowCallback) {
	if (hasBackBtn || hasDoneBtn) {
    	this.showNavBar();
    } else {
    	this.hideNavBar();
    }

    var screenData = this._screenMap[this._screenMap.length - 1];
    if (screenData == null) return;

    var screenId = screenData.screenId;
    var currentScreen = this._screenList[screenId];
    if (currentScreen != null) {
    	Util.exec(currentScreen.onShow);
    }

    // Exec the callback when screen show
    Util.exec(onShowCallback);

    MainScreen.getInstance().hideSpinner();
};