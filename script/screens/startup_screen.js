function StartupScreen () {
}

StartupScreen.inheritsFrom(View);

StartupScreen.ID = "startup-screen";
StartupScreen.OPTIONS_ID = "options"
StartupScreen.HTML = 	'<div id="{0}" class="{1} full-screen">' +
							'<div class="logo">Truth or Dare</div>' +
							'<div class="{2}"></div>' +
							'<div class="about">' +
								'<span class="about-detail about-label">Developed and Designed By</span>' +
								'<span class="about-detail about-name">{3}</span>' +
								'<span class="about-detail about-label">Powered By</span>' +
								'<span class="about-detail about-name">{4}</span>' +
							'</div>' +
						'</div>';

StartupScreen.prototype.init = function() {
	StartupScreen.prototype.super.init.call(this, StartupScreen.ID);

	var jquery = $(StartupScreen.HTML.format(StartupScreen.ID, 
		StartupScreen.ID, StartupScreen.OPTIONS_ID, Settings.ABOUT.DesignedBy,
		Settings.ABOUT.PoweredBy));
	this.setView(jquery);

	return this;
};

StartupScreen.prototype.onShow = function () {
	// Init start button
	var startBtnClass = "start-game-button";
	var startBtn = new TextButton().init(StartupScreen.ID + "-" + startBtnClass, 
										startBtnClass + " shadow", 
										"Start", 
										startBtnClass, startBtnClass, 
										true, this.onStartGame.bind(this));
	this.getView().find("." + StartupScreen.OPTIONS_ID).empty().append(startBtn.getView());

	var logo = this.getView().find(".logo");
	var about = this.getView().find(".about");
	
	logo.hide();
	startBtn.hide();
	about.hide();

	logo.animate({top:"-20%"}, 0, function () {
		logo.show();
		startBtn.getView().animate({left:"120%"}, 0, function () {
			startBtn.show();
		});
		
		logo.animate({top:"10%"}, 800, "easeOutBounce", function () {
			startBtn.getView().animate({left:"20%"}, 1000, "easeOutBounce", function () {
				about.fadeIn(1000);
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

StartupScreen.prototype.onStartGame = function () {
	MainScreen.getInstance().onStartGame();
};
