/**
 * Represent the PlayerPieScreen
 *
 */

function PlayerPieScreen () {
}

PlayerPieScreen.inheritsFrom(View);

PlayerPieScreen.ID = "player-pie";
PlayerPieScreen.VIEW_ID = "player-pie-view";
PlayerPieScreen.PIE_CONTAINER = "pie-container";
PlayerPieScreen.PLAYER_LIST_CONTAINER_ID = "pie-players-container";
PlayerPieScreen.START_BTN_CONTAINER_ID = "pie-start-btn-container";
PlayerPieScreen.HTML = '<div id="{0}" class="{1} full-screen">' +
							'<div class="{2}">' +
							'</div>' +
							'<div class="{3}"></div>' +
							'<div class="{4}"></div>' +
						'</div>';
PlayerPieScreen.CANVAS_HTML = '<canvas id="{0}" width="150px" height="150px"></canvas>';

PlayerPieScreen.DURATION_FOR_EACH_CIRCLE = 1000;
PlayerPieScreen.MIN_ANGLE = 2000;
PlayerPieScreen.MAX_ANGLE = 7000;

PlayerPieScreen.prototype.init = function(players) {
	PlayerPieScreen.prototype.super.init.call(this, PlayerPieScreen.ID);

	var jquery = $(PlayerPieScreen.HTML.format(PlayerPieScreen.ID, PlayerPieScreen.ID, PlayerPieScreen.PIE_CONTAINER,
		PlayerPieScreen.PLAYER_LIST_CONTAINER_ID, PlayerPieScreen.START_BTN_CONTAINER_ID));
	this.setView(jquery);

	return this;
};

PlayerPieScreen.prototype.initWithPlayers = function (players) {

	// Init pie
	var color = null;
	var colorList = [];
	var filterFn = function (r, g, b) {
		if (colorList.length == 0) return true;

		var minDelta = 100;
		if (Math.abs(r - g - b) < minDelta / 3) return false;

		var delta = null;
		var val = null;
		for (var i = 0; i < colorList.length; i++) {
			val = colorList[i];
			delta = Math.abs(val[0] - r) + Math.abs(val[1] - g) + Math.abs(val[2] - b);
			if (delta < minDelta) {
				return false;
			}

			return true;
		}		
	}.bind(this);

	this._playerList = [];

	$.each(players, function (index, val) {
		color = Util.randomColor(colorList, filterFn);
		colorList.push(color);
		this._playerList.unshift({
			id: index,
			name: val,
			color: color
		});
	}.bind(this));

	this.drawPieAndComponent();
};

PlayerPieScreen.prototype.rotatePie = function (e) {
	this._sessionId++;
	MainScreen.getInstance().showSpinner();
	var angle = Util.randomInRange(PlayerPieScreen.MIN_ANGLE, PlayerPieScreen.MAX_ANGLE);
	var duration = (angle / 360) * PlayerPieScreen.DURATION_FOR_EACH_CIRCLE;

	this._jQueryPie.animateRotate(angle, this._currentAngle, duration, "easeOutBounce", function () {
		// Reset angle
		var angleString = this._jQueryPie.attr("style");
		angleString = angleString.substring(angleString.indexOf("rotate") + 7, angleString.indexOf("deg"))
		this._currentAngle = (parseInt(angleString) % 360);
		this._jQueryPie.css("-webkit-transform", "rotate({0}deg)".format(this._currentAngle));

		// Find player
		var cellVal = (360 / this._playerList.length);
		var playerId = Math.round((this._currentAngle - cellVal / 2) / cellVal);
		playerId = this._playerList.length - (playerId + 1);
		console.log("Player: " + playerId);
		setTimeout(function () {
			var player = this.getPlayerWithId(playerId)
			if (player != null) {
				// Find the player
				MainScreen.getInstance().hideSpinner();
				
				this.showTruthScreen(player.name);
			} else {
				
			}
		}.bind(this), 1000);
	}.bind(this));
	this._currentAngle += angle;

	e.stopPropagation();
};

PlayerPieScreen.prototype.drawPieAndComponent = function () {
	if (this._playerList.length == 0) {
		// TODO: Show error message
	}

	// Init vars
	this._currentAngle = 0;
	var itemListContainer = this.getView().find("." + PlayerPieScreen.PLAYER_LIST_CONTAINER_ID);

	// Clear the view
	itemListContainer.empty();

	// Init players list
	this._itemList = new ScrollableItemList().init("pie-players", null, this.onDeletePlayer.bind(this));
	itemListContainer.append(this._itemList.getView());

	var color = null;
	var playerItem = null;
	var valueForEachPlayer = 100 / this._playerList.length;
	var data = [];
	$.each(this._playerList, function (index, player) {
		color = Util.RGBA_COLOR_FORMAT.format(player.color[0], player.color[1], player.color[2], 1);
		data.unshift({
			value: valueForEachPlayer,
			color: color
		});

		// Add item to list
		playerItem = this._itemList.addItem(player.id, player.name);
		playerItem.getView().css("background-color", color);
	}.bind(this));

	this._itemList.makeScrollList();

	var options = {};

	//Get the context of the canvas element we want to select
	this._jQueryPie = $(PlayerPieScreen.CANVAS_HTML.format(PlayerPieScreen.VIEW_ID));
	var jQueryPieContainer = this.getView().find("." + PlayerPieScreen.PIE_CONTAINER);
	jQueryPieContainer.empty().append('<div class="pie-indicator"></div>').append(this._jQueryPie);
	this._jQueryPie.css("-webkit-transform", "rotate({0}deg)".format(this._currentAngle));
	var ctx = this._jQueryPie[0].getContext("2d");
	new Chart(ctx).Pie(data, options);

	// Set click event
	Util.click(this._jQueryPie, this.rotatePie.bind(this));
	this._sessionId = 0;

	var piePosLeft = $("body").width() / 2 - this._jQueryPie.width() / 2;
	jQueryPieContainer.css({left: piePosLeft});
};

PlayerPieScreen.prototype.getListItemValue = function () {
	return this._itemList.getListItemValue();
};

PlayerPieScreen.prototype.onDeletePlayer = function (playerId) {
	var player = null;
	for (var i = 0; i < this._playerList.length; i++) {
		player = this._playerList[i];
		if (player.id == playerId) {
			this._playerList.splice(i, 1);
			break;
		}
	}

	GameInfoManager.instance.storePlayers(this._playerList.getItem());
	this.drawPieAndComponent();

};

PlayerPieScreen.prototype.showTruthScreen = function (playerName) {
	MainScreen.getInstance().showOverlay(playerName);
};


PlayerPieScreen.prototype.getPlayerWithId = function (playerId) {
	for (var i = 0; i < this._playerList.length; i++) {
		if (this._playerList[i].id == playerId) {
			return this._playerList[i];
		}
	}
};


