function OverlayScreen () {
}

OverlayScreen.inheritsFrom(View);

OverlayScreen.ID = "overlay-screen";
OverlayScreen.PLAYER_INFO_ID = "overlay-screen-player-info";
OverlayScreen.CONTENT_ICON_ID = "overlay-screen-content-icon";
OverlayScreen.CONTENT_WRAPPER_ID = "overlay-screen-content-wrapper";
OverlayScreen.CONTENT_ID = "overlay-screen-content";
OverlayScreen.YES_BTN_ID = "overlay-screen-yes-btn";
OverlayScreen.NO_BTN_ID = "overlay-screen-no-btn";
OverlayScreen.CHECK_BTN_ID = "overlay-screen-check-btn";

OverlayScreen.QUESTION_CLASS = "question-icon";
OverlayScreen.TRUTH_CLASS = "truth-icon";
OverlayScreen.DARE_CLASS = "dare-icon";

OverlayScreen.SCREEN_TYPE_QUESTION 	= 0;
OverlayScreen.SCREEN_TYPE_TRUTH 	= 1;
OverlayScreen.SCREEN_TYPE_DARE 		= 2;

OverlayScreen.HTML = 	'<div id="{0}" class="{1} full-screen">' +
							'<div class="overlay-screen-container shadow">' +
								'<div class="overlay-screen-player-info-container shadow">' +
									'<div class="overlay-screen-player-icon"></div>' +
									'<div class="{2}"></div>' +
								'</div>' +
								'<div class="overlay-screen-content-container">' + 
									'<div class="{3} shadow question-icon"></div>' +
									'<div class="{4}">' + 
										'<div class="{5} scroller"></div>' +
									'</div>' +
								'</div>' +
								'<div class="overlay-screen-button-container">' +
									'<div class="overlay-screen-btn {6} no-icon shadow"></div>' +
									'<div class="overlay-screen-btn {7} check-icon shadow"></div>' +
									'<div class="overlay-screen-btn {8} yes-icon shadow"></div>' +
								'</div>' +
							'</div>' +
						'</div>';

OverlayScreen.prototype.init = function() {
	OverlayScreen.prototype.super.init.call(this, OverlayScreen.ID);

	var jquery = $(OverlayScreen.HTML.format(OverlayScreen.ID, 
		OverlayScreen.ID, OverlayScreen.PLAYER_INFO_ID, OverlayScreen.CONTENT_ICON_ID,  OverlayScreen.CONTENT_WRAPPER_ID,
		OverlayScreen.CONTENT_ID, OverlayScreen.NO_BTN_ID, OverlayScreen.CHECK_BTN_ID, OverlayScreen.YES_BTN_ID));
	this.setView(jquery);

	//his._isFirstTime = true;
	return this;
};

OverlayScreen.prototype.onShow = function () {
	// Init start button
	this._yesBtn = this.getView().find("." + OverlayScreen.YES_BTN_ID);
	this._noBtn = this.getView().find("." + OverlayScreen.NO_BTN_ID);
	this._checkBtn = this.getView().find("." + OverlayScreen.CHECK_BTN_ID);
	this._jQueryPlayerInfo = this.getView().find("." + OverlayScreen.PLAYER_INFO_ID);
	this._jQueryContentIcon = this.getView().find("." + OverlayScreen.CONTENT_ICON_ID);
	this._jQueryContent = this.getView().find("." + OverlayScreen.CONTENT_ID);

	this._jQueryPlayerInfoContainer = this.getView().find(".overlay-screen-player-info-container");
	this._jQueryContentContainer = this.getView().find(".overlay-screen-content-container");
	this._jQueryBtnContainer = this.getView().find(".overlay-screen-button-container");

	Util.click(this._yesBtn, function () {
		Util.exec(this._yesBtnCallback);
	}.bind(this));

	Util.click(this._noBtn, function () {
		Util.exec(this._noBtnCallback);
	}.bind(this));

	Util.click(this._checkBtn, function () {
		Util.exec(this._checkBtnCallback);
	}.bind(this));	
	

	var checkBtnLeft = this.getView().find(".overlay-screen-button-container").width() / 2 - 65 / 2;	
	this._checkBtn.css({left: checkBtnLeft});

	this._jQueryPlayerInfoContainer.hide();
	this._jQueryContentContainer.hide();
	this._jQueryBtnContainer.hide();

	this.showScreenContent();
};

OverlayScreen.prototype.showScreenContent = function () {
	// Check screen type and show data
	this._jQueryPlayerInfo.html(this._playerName);
	this._jQueryContent.html(this._contentInfo);

	switch(this._screenType) {
		case OverlayScreen.SCREEN_TYPE_QUESTION:
			this._jQueryContentIcon.removeClass(OverlayScreen.TRUTH_CLASS);
			this._jQueryContentIcon.removeClass(OverlayScreen.DARE_CLASS);
			this._jQueryContentIcon.addClass(OverlayScreen.QUESTION_CLASS);

			this._yesBtn.hide().fadeIn(500);
			this._noBtn.hide().fadeIn(500);
			this._checkBtn.hide();
		break;

		case OverlayScreen.SCREEN_TYPE_TRUTH:
			this._jQueryContentIcon.addClass(OverlayScreen.TRUTH_CLASS);
			this._jQueryContentIcon.removeClass(OverlayScreen.DARE_CLASS);
			this._jQueryContentIcon.removeClass(OverlayScreen.QUESTION_CLASS);

			this._yesBtn.hide();
			this._noBtn.hide();
			this._checkBtn.hide().fadeIn(500);
		break;

		case OverlayScreen.SCREEN_TYPE_DARE:
			this._jQueryContentIcon.removeClass(OverlayScreen.TRUTH_CLASS);
			this._jQueryContentIcon.addClass(OverlayScreen.DARE_CLASS);
			this._jQueryContentIcon.removeClass(OverlayScreen.QUESTION_CLASS);

			this._yesBtn.hide();
			this._noBtn.hide();
			this._checkBtn.hide().fadeIn(500);
		break;
	}

	this._jQueryPlayerInfoContainer.fadeIn(300);
	this._jQueryContentContainer.fadeIn(300);
	this._jQueryBtnContainer.fadeIn(300);
	this.makeContentScrollable();
};

OverlayScreen.prototype.setScreenData = function (options) {
	this._screenType = Util.getDefaultValue(options.screenType, OverlayScreen.SCREEN_TYPE_QUESTION);
	this._playerName = Util.getDefaultValue(options.playerName, OverlayScreen.DEFAULT_PLAYER_NAME);
	this._contentInfo = Util.getDefaultValue(options.contentInfo, "");
	this._yesBtnCallback = Util.getDefaultValue(options.yesBtnCallback, null);
	this._noBtnCallback = Util.getDefaultValue(options.noBtnCallback, null);
	this._checkBtnCallback = Util.getDefaultValue(options.checkBtnCallback, function () {
		MainScreen.getInstance().backScreen({direction: ScreenManager.DIRECTION_TOP_TO_BOTTOM});
	});
};

OverlayScreen.prototype.makeContentScrollable = function () {
	var jQueryContent = this.getView().find("." + OverlayScreen.CONTENT_WRAPPER_ID);
	this._scrollContent = new IScroll(jQueryContent[0], {
		scrollbars: true,
		scrollY: true
	});
};
