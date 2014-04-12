/**
*
* Manage the timer
*/

function Timer() { }

/*Timer.prototype._id = null;*/

// Init timer manager
Timer.prototype.init = function (callback, interval, isPlayNow, isLoop) {

    var counter = (isPlayNow != null && isPlayNow === true) ? 1 : 0;
    var handler = function () {
        if (counter > 0) {
            callback.perform();

            if (!isLoop) {
                this.stop();
                handler = null;
            }
        };
        counter++;
    }.bind(this);

    this._id = window.setInterval(handler, interval);
    if ( isPlayNow === true) {
        callback.perform()
    };
    
    return this;
};

// Stop time
Timer.prototype.stop = function () {
    window.clearInterval(this._id);
    this._id = null;
};