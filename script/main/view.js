/**
* View class for manage the View jQuery object 
*/

function View() { }


View.prototype.init = function (id) {
    this._id = id;
    this._isClickDisable = false;
    this.onShow = this.onShow.bind(this);
    this.screenWillShow = this.screenWillShow.bind(this);
    
    return this;
};

View.prototype.setView = function (jquery) {
    if (jquery == null)
        throw "jQuery object is null";

    if (!(typeof jquery === jQuery)) { 	// If the jquery is the String, 
        //then convert it to jQuery object
        jquery = $(jquery);
    }

    this._view = jquery;
};

View.prototype.getView = function () {
    return this._view;
};

View.prototype.setId = function (id) {
    this._id = id;
};

View.prototype.getId = function () {
    return this._id;
};

View.prototype.show = function (speed) {
    this._view.show(speed);
};

View.prototype.hide = function (speed) {
    this._view.hide(speed);
};

View.prototype.setPosition = function (top, left) {
    Util.setPosition(this._view, top, left);
};

View.prototype.getPosition = function () {
    return this._view.position();
};

View.prototype.getOffsetPosition = function () {
    return this._view.offset();
};

View.prototype.getSize = function () {
    return {
        width: this._view.width(),
        height: this._view.height()
    };
};

View.prototype.setSize = function (width, height) {
    
    Util.setSize(this._view, width, height);
};

View.prototype.isShow = function () {
    if (this._view.css('display') == 'none') {
        return false;
    }

    return true;
};

View.prototype.disable = function () {
    this._isClickDisable = true;
};

View.prototype.isDisabled = function () {
    return this._isClickDisable;
};

View.prototype.enable = function (handler) {
    this._isClickDisable = false;
};

View.prototype.disableImageDraggable = function () {
    View.disableDraggable(this.getView().find('img'));
};

View.disableDraggable = function (jquery) {
    jquery.on('dragstart', function (event) { event.preventDefault(); });
};

View.prototype.disbleViewInPeriod = function (delayTime) {
    Util.disbleViewInPeriod(this, delayTime);
};

View.prototype.onShow = function () {

};

View.prototype.screenWillShow = function () {

};
