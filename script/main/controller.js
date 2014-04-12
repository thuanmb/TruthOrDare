/**
* Use the module pattern for create the singleton Controller object 
*
*/
Controller = (function () {
    var uniqueInstantce;

    function constructor () {
    
        return {
            // Public methods
            //

            /**
            * Init the controller
            */
            init: function () {
                
                //Disable right click
                //$(document).bind("contextmenu", function(e) { return false; }); 

                this.loadView();
                return this;
            },

            loadView: function () {
                MainScreen.getInstance().init();
            }
        }
    }

    return {
        getInstance: function () {
            if (!uniqueInstantce) {
                uniqueInstantce = constructor();
            }

            return uniqueInstantce;
        }
    }
})();