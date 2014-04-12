MainScreen = (function () {
    var uniqueInstance;

    /**
    * Present the screen
    */
    function ScreenView() { }

    ScreenView.inheritsFrom(View);

    var ID = "screen-view";
    var HTML = '<div id="{0}" class="full-screen">' +
                   
                '</div>';

    /**
    * Init the Screen View
    */
    ScreenView.prototype.init = function (mapData) {
        ScreenView.prototype.super.init.call(this, ID);
        var jquery = $(HTML.format(ID));

        //Disable right click
        $(document).bind("contextmenu",function(e) {
                  return false;
        }); 

        LocalStorage.instance.init("TRUTH_OR_DARE:");
        GameInfoManager.instance.init();

        // Init spinner
        this._spinner = new SpinWidget().init("main", 0, 0, "100%", "100%", "rgba(0,0,0,0.4)",
                                        5, 2, 5, "rgba(255,255,255,0.8)", 13);
        jquery.append(this._spinner.getView());
        this.hideSpinner();

        // Init screen manager
        this._screenManager = new ScreenManager().init(function () {
            NativeInvoker.instance.invoke("closeApplication");
        });
        jquery.append(this._screenManager.getView());

        // Init startup screen
        this._startupScreen = new StartupScreen().init();
        this._screenManager.addScreen(this._startupScreen);
        
        // Init the pie screen
        this._playerPieScreen = new PlayerPieScreen().init();
        this._screenManager.addScreen(this._playerPieScreen);

         // Init add item screen
        this._addPlayersScreen = new AddItemScreen().init("players");
        this._screenManager.addScreen(this._addPlayersScreen);

        this._addTruthsScreen = new AddItemScreen().init("truths");
        this._screenManager.addScreen(this._addTruthsScreen);

        this._addDaresScreen = new AddItemScreen().init("dares");
        this._screenManager.addScreen(this._addDaresScreen);

        // Init overlay screen
        this._overlayScreen = new OverlayScreen().init();
        this._screenManager.addScreen(this._overlayScreen);

        // Show startup screen
        this._screenManager.pushScreen(this._startupScreen.getId());

        // Init interface
        NativeListener.instance.init({
            onBackPressed: function () {
                var options = null;
                if (this._screenManager._isOverlayScreen == true) {
                    options = {direction: ScreenManager.DIRECTION_TOP_TO_BOTTOM};
                }

                this._screenManager.backScreen(options);
            }.bind(this)
        });

        $("body").append(jquery);
        
        delete jquery;
        return this;
    };

    ScreenView.prototype.onStartGame = function () {
        this._screenManager.pushScreen(this._addPlayersScreen.getId(),  {
            hasDoneBtn: true,
            hasBackBtn: true,
            navLabel: "Add Player",
            onShowCallback: function () {
                var players = GameInfoManager.instance.getPlayers();
                this._addPlayersScreen.showWithContent({
                    screenName: "add-players-screen",
                    currentItems: players,
                    placeHolderTextField: 'Input the players name here'
                });        
            }.bind(this),
            backBtnCallback: this.storePlayers.bind(this),
            doneBtnCallback: function () {
                if (GameInfoManager.instance.getPlayers() != null && 
                    GameInfoManager.instance.getPlayers().length < 1) {
                    alert("Please add at least 2 players first!");
                    return;
                }

                this.storePlayers();
                this._screenManager.pushScreen(this._playerPieScreen.getId(), {
                    hasBackBtn: true,
                    navLabel: "Truth or Dare",
                    onShowCallback: function () {
                        this._playerPieScreen.initWithPlayers(GameInfoManager.instance.getPlayers());
                    }.bind(this),
                    backBtnCallback: function () {
                        var players = this._playerPieScreen.getListItemValue();
                        GameInfoManager.instance.storePlayers(players);
                    }.bind(this),
                });
            }.bind(this),
        });
    };

    ScreenView.prototype.storePlayers = function () {
        var players = this._addPlayersScreen.getListItemValue();
        GameInfoManager.instance.storePlayers(players);

        return this;
    };

    ScreenView.prototype.storeTruths = function () {
        var truths = this._addTruthsScreen.getListItemValue();
        GameInfoManager.instance.storeTruths(truths);

        return this;
    };

    ScreenView.prototype.storeDares = function () {
        var dares = this._addDaresScreen.getListItemValue();
        GameInfoManager.instance.storeDares(dares);

        return this;
    };

    ScreenView.prototype.hideSpinner = function () {
        this._spinner.hide();

        return this;
    };

    ScreenView.prototype.showSpinner = function () {
        this._spinner.show();

        return this;
    };

    ScreenView.prototype.backScreen = function (options) {
        this._screenManager.backScreen(options);

        return this;
    };

    ScreenView.prototype.showOverlay = function (playerName) {
        // var truthContent = GameInfoManager.instance.randomTruth();
        // this._overlayScreen.setScreenData({
        //     screenType: 0,
        //     playerName: playerName,
        //     contentInfo: truthContent,
        //     yesBtnCallback : function () {
        //         this._overlayScreen.setScreenData({
        //             screenType: 1,
        //             playerName: playerName,
        //             contentInfo: truthContent,
        //         });
        //         this._overlayScreen.showScreenContent();
        //     }.bind(this),
        //     noBtnCallback: function () {
        //         var dareContent = GameInfoManager.instance.randomDare();;
        //         this._overlayScreen.setScreenData({
        //             screenType: 2,
        //             playerName: playerName,
        //             contentInfo: dareContent,
        //         });
        //         this._overlayScreen.showScreenContent();
        //     }.bind(this), 
        // });
        // this._screenManager.pushScreen(this._overlayScreen.getId(), {direction: ScreenManager.DIRECTION_BOTTOM_TO_TOP});
        //var truthContent = GameInfoManager.instance.randomTruth();
        this._overlayScreen.setScreenData({
            screenType: 0,
            playerName: playerName,
            contentInfo: "You are in turn! Truth or Dare?",
            yesBtnCallback : function () {
                this._overlayScreen.setScreenData({
                    screenType: 1,
                    playerName: playerName,
                    contentInfo: "Think and answer your question :)!",
                });
                this._overlayScreen.showScreenContent();
            }.bind(this),
            noBtnCallback: function () {
                var dareContent = GameInfoManager.instance.randomDare();;
                this._overlayScreen.setScreenData({
                    screenType: 2,
                    playerName: playerName,
                    contentInfo: 'Good luck _ _"',
                });
                this._overlayScreen.showScreenContent();
            }.bind(this), 
        });
        this._screenManager.pushScreen(this._overlayScreen.getId(), {
            direction: ScreenManager.DIRECTION_BOTTOM_TO_TOP,
            isOverlayScreen: true
        });
    }

	return {
	    getInstance: function () {
	        if (!uniqueInstance) {
	            uniqueInstance = new ScreenView();
	        }

	        return uniqueInstance;
	    }
	};
})();

