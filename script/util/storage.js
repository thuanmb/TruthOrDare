/**
 * Basic class for storage
 *
 */

function Storage () {
}

Storage.prototype.init = function (id) {
	this._id = id;
};

Storage.prototype.store = function (key, value) {
	if (key != null  && value != null) {
		this.execStore(this._id + key, JSON.stringify(value));
		return true;
	}

	return false;
};

Storage.prototype.execStore= function (key, value) {
	throw "Not implement yet";
};

Storage.prototype.retrieve = function (key) {
	if (key != null) {
		var value = this.execRetrieve(this._id + key);
		if (value != null) {
			return JSON.parse(value);
		}
	}

	return null;
};

Storage.prototype.execRetrieve = function (key, value) {
	throw "Not implement yet";
};

/**
 * Local storage
 *
 */
function LocalStorage () {
}

LocalStorage.inheritsFrom(Storage);
LocalStorage.instance = new LocalStorage();

LocalStorage.prototype.execStore = function (key, value) {
	localStorage.setItem(key, value);
};

LocalStorage.prototype.execRetrieve = function (key, value) {
	return localStorage.getItem(key);
};

