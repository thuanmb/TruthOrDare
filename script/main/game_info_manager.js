function GameInfoManager () {
}

GameInfoManager.instance = new GameInfoManager();
GameInfoManager.PLAYERS_ID = "player-list";
GameInfoManager.TRUTHS_ID = "truth-list";
GameInfoManager.DARES_ID = "dare-list";

GameInfoManager.prototype.init = function() {
	this._players = this.getPlayers();
	this._truths = this.getTruths();
	this._dares = this.getDares();
};

GameInfoManager.prototype.getPlayers = function () {
	this._players = LocalStorage.instance.retrieve(GameInfoManager.PLAYERS_ID);

	return Util.getDefaultValue(this._players, []);
};

GameInfoManager.prototype.getTruths = function () {
	this._truths = LocalStorage.instance.retrieve(GameInfoManager.TRUTHS_ID);

	return Util.getDefaultValue(this._truths, []);
};

GameInfoManager.prototype.getDares = function () {
	this._dares = LocalStorage.instance.retrieve(GameInfoManager.DARES_ID);

	return Util.getDefaultValue(this._dares, []);
};

GameInfoManager.prototype.storePlayers = function (players) {
	LocalStorage.instance.store(GameInfoManager.PLAYERS_ID, players);

	return this;
};

GameInfoManager.prototype.storeTruths = function (truths) {
	LocalStorage.instance.store(GameInfoManager.TRUTHS_ID, truths);

	return this;
};

GameInfoManager.prototype.storeDares = function (dares) {
	LocalStorage.instance.store(GameInfoManager.DARES_ID, dares);

	return this;
};

GameInfoManager.prototype.randomDare = function () {
	var dares = GameInfoManager.instance.getDares();
    var randomIndex = Util.randomInRange(0, dares.length - 1);

    return dares[randomIndex];
};

GameInfoManager.prototype.randomTruth = function () {
	var truths = GameInfoManager.instance.getTruths();
    var randomIndex = Util.randomInRange(0, truths.length - 1);

    return truths[randomIndex];
};