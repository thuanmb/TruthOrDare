/**
* Utils
*
*/
function Util () {}

Util.RGBA_COLOR_FORMAT = "rgba({0}, {1}, {2}, {3})"
/**
* Add style to the body
*
*/
Util.STYLE_HTML = '<style type="text/css">{0}</style>';
Util.addStyle = function (style) {
	var html = Util.STYLE_HTML.format(style);
	$(html).appendTo("body");
};

/**
* Add the border
*
*/
Util.BORDER_TEMPLATE = "{0}px solid {1}";
Util.addBorder = function (jQuery, size, color) {
	var border = Util.BORDER_TEMPLATE.format(size, color);
	jQuery.css("border", border);
};

/**
* Remove border
*
*/
Util.removeBorder = function (jQuery) {
	jQuery.css("border", "none");
};

/**
* Set position
*
*/
Util.setPosition = function (jQuery, top, left) {
    jQuery.css("top", top);
    jQuery.css("left", left);
};

/**
* Set size
*
*/
Util.setSize = function (jQuery, width, height) {
    jQuery.css("width", width);
    jQuery.css("height", height);
};


/**
* Stop Propagation
*
*/
Util.stopPropagation = function (jQuery) {
	jQuery.click(function (e) {
		e.stopPropagation();	
	});

	jQuery.mousedown(function (e) {
		e.stopPropagation();	
	});
};

/**
* Set image source
*
*/
Util.setImageSource = function ( jQuery, src ) {
	jQuery.attr("src", src);
};

/**
* Get the string following the max length
*
*/
Util.getStringByLength = function (text, maxLength) {
	var result = null;
    result = text.substring(0, maxLength);
    if (maxLength < text.length) {
        result += "...";
    }

    return result;
};

/**
* Disable view object in xxx ms
*
*/
Util.disbleViewInPeriod = function (viewObj, delayTime) {
	viewObj.disable();
	var callback = new Callback().init(function () {
        viewObj.enable();
        timer.stop();
        delete timer;
        delete callback;
    }.bind(this));
    var timer = new Timer().init(callback, delayTime, false);
};

/**
* Create the scale animation
*
* @param shape			The object need to animate
* @param isToggle 		Indicating the animation is toggle or not
* @param minScaleSize 	The min scale value
* @param maxScaleSize 	The max scale value
* @param interval 		The interval
* @param easy			The easy function
*/
Util.setScaleAnimation = function (shape, minScaleSize, maxScaleSize, interval, 
										easy, isRepeat) {
	
	var zoomIn = Util.getScaleCommand(maxScaleSize);
	var zoomOut = Util.getScaleCommand(minScaleSize);

	var animateFunction = function () {
		shape.animate({'transform': zoomIn}, interval, easy, function() {  
	    	/* callback after original animation finishes */  
	    	this.animate({  
	        	'transform': zoomOut
	    	}, interval);  
		});
	};

	// Animation the start point
	animateFunction();

	if (isRepeat) {
		var timer = new Timer().init(new Callback().init(animateFunction), interval * 2, true, true);
		return timer;
	}

};

/**
* Create the up and down animation
*
* @param shape			The object need to animate
* @param isToggle 		Indicating the animation is toggle or not
* @param minScaleSize 	The min scale value
* @param maxScaleSize 	The max scale value
* @param interval 		The interval
* @param easy			The easy function
*/
Util.setUpDownAnimation = function (shape, targetX, targetY, interval, 
										easy, isRepeat) {
	var downTransformString = Util.getTransformString(targetX, targetY);
	var upTransformString = Util.getTransformString(targetX, 0);

	var animateFunction = function () {
		shape.animate({"transform": downTransformString}, interval, easy, function() {  
	    	this.animate({"transform": upTransformString}, interval);
		});
	};

	var timer = new Timer().init(new Callback().init(animateFunction), interval * 2, true, isRepeat);
	return timer;
};

/**
* Delete the array of object
*
*/
Util.deleteObjectArray = function (array) {
	if(array != null) {
		$.each(array, function () {
	        delete object;
	    });
	}
};

/**
* Load HTML files
* 
*/
Util.loadHTMLFile = function (views, successCallback, errorCallback) {

        var deferreds = [];
        var resultData = [];

        $.each(views, function(index, view) {
            deferreds.push($.get('html/' + view + '.html', function(data) {
                resultData.push(data);
            }, 'html'));
        });

       	$.when.apply(null, deferreds).done(function () {
       		successCallback.perform(resultData);
       	}).fail(errorCallback);
};

/**
* Convert the pixel string to number
* 
*/
Util.toNumber = function (pixelString) {
	try {
		if (pixelString == null) {
			return 0;
		}

		if (pixelString instanceof String) {
			pixelString  = pixelString.trim();
		}

		return parseInt(pixelString, 10);
	}
	catch (e) {
		return 0;
	}
};

/**
* Reading bytes from a string
*
*/
Util.stringToBytes = function ( str ) {
  var ch, st, re = [];
  for (var i = 0; i < str.length; i++ ) {
    ch = str.charCodeAt(i);  // get char 
    st = [];                 // set up "stack"
    do {
      st.push( ch & 0xFF );  // push byte to stack
      ch = ch >> 8;          // shift value down by 1 byte
    }  
    while ( ch );
    // add stack contents to result
    // done because chars have "wrong" endianness
    re = re.concat( st.reverse() );
  }
  // return an array of bytes
  return re;
};

Util.encodeBase64 = function (data)
{
    var str = String.fromCharCode.call(null, data);
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
}

/**
* Convert the CSS string to object
*
*/
Util.toCSSObject = function (cssString) {
	if (cssString == null || cssString == "") {
		return {};
	}

	var result = {};
	cssString = cssString.split(";")

	var tmp = null;
	$.each (cssString, function () {
		tmp = this.split(":");
		if (tmp.length > 1) {
			result[tmp[0].trim()] = tmp[1].trim();
		}
	});

	return result;
};

Util.getDefaultValue = function (val, defaultVal) {
	return (val == null ? defaultVal : val);
};

Util.exec = function (obj, args) {
	if (obj != null) {
		if (obj.perform != null) {
			obj.perform(args);
		} else if ($.isFunction(obj)) {
			obj(args);
		}
	}

	return obj;
};

Util.click = function(jquery, arg0, arg1) {
	if(isTouch){
		if (arg1 != null) {
			jquery.bind('touchstart', arg0, arg1);
		}
		else {
			jquery.bind('touchstart', arg0);
		}
	}
	else {	
		if (arg1 != null) {
			jquery.click(arg0, arg1);
		}
		else {
			jquery.click(arg0);
		}
	}
	
	return jquery;
};

Util.triggerClick = function(jquery) {
	if (isTouch) {
		jquery.trigger("touchstart");
	}
	else {
		jquery.trigger("click");
	}
};

/**
 * Allows for the appropriate mechanism to register a mousedown
 * event for the different platforms.  Specifically addresses
 * the difference between iOS touchscreen and others
 */
Util.mousedown = function(jquery, arg0, arg1) {
	if (isTouch) {
		if (arg1 != null) {
			jquery.bind('touchstart', arg0, arg1);
		}
		else {
			jquery.bind('touchstart', arg0);
		}
	}
	else {
		if (arg1 != null) {
			jquery.mousedown(arg0, arg1);
		}
		else {
			jquery.mousedown(arg0);
		}
	}
};

/**
 * Allows for the appropriate mechanism to register a mouseup
 * event for the different platforms.  Specifically addresses
 * the difference between iOS touchscreen and others
 */
Util.mouseup = function(jquery, arg0, arg1) {
	if (isTouch) {
		if (arg1 != null) {
			jquery.bind('touchend', arg0, arg1);
		}
		else {
			jquery.bind('touchend', arg0);
		}
	}
	else {
		if (arg1 != null) {
			jquery.mouseup(arg0, arg1);
		}
		else {
			jquery.mouseup(arg0);
		}
	}
};

/**
 * Allows for the appropriate mechanism to register a mousemove
 * event for the different platforms.  Specifically addresses
 * the difference between iOS touchscreen and others
 */
Util.mousemove = function(jquery, arg0, arg1) {
	if (isTouch) {
		if (arg1 != null) {
			jquery.bind('touchmove', arg0, arg1);
		}
		else {
			jquery.bind('touchmove', arg0);
		}
	}
	else {
		if (arg1 != null) {
			jquery.mousemove(arg0, arg1);
		}
		else {
			jquery.mousemove(arg0);
		}
	}
};
		
Util.getMouseDownPoint = function(e) {
	return isTouch ? (e.touches != null ? e.touches[0] : e.originalEvent.touches[0]) : e;
};

Util.getMouseUpPoint = function(e) {
	return isTouch ? (e.changedTouches != null ? e.changedTouches[0] : e.originalEvent.changedTouches[0]) : e;
};

Util.randomInRange = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

Util.MAX_COLOR_RANDOM = 255;
Util.randomColor = function (exceptionList, filterFn, count) {
	count = (count == null ? 0 : count);

	if (count == Util.MAX_COLOR_RANDOM);
	var r = Util.randomInRange(0, 255);
	var g = Util.randomInRange(0, 255);
	var b = Util.randomInRange(0, 255);

	var color = null;
	if (exceptionList != null) {
		for (var i = 0; i < exceptionList.length; i++) {
			color = exceptionList[i];
			if (r == color[0] && g == color[1] && b == color[2]) {
				color = Util.randomColor(exceptionList, filterFn, count);
				break;
			} else {
				color = null;
			}
		}
	}

	if (filterFn != null) {
		if (!filterFn(r, g, b)) {
			color = Util.randomColor(exceptionList, filterFn, count);
		}
	}

	if (color == null) {
		color = [r, g, b];
	}

	return color;
};

Util.getCurrentAngle = function (el) {
    var st = window.getComputedStyle(el, null);
    var tr = st.getPropertyValue("-webkit-transform") ||
             st.getPropertyValue("-moz-transform") ||
             st.getPropertyValue("-ms-transform") ||
             st.getPropertyValue("-o-transform") ||
             st.getPropertyValue("transform") ||
             "fail...";

    var currentAngle = 0;
    if (tr != "none") {
        var values = tr.split('(')[1];
        values = values.split(')')[0];
            values = values.split(',');
        var a = values[0];
        var b = values[1];
        var c = values[2];
        var d = values[3];

        var scale = Math.sqrt(a*a + b*b);

        // arc sin, convert from radians to degrees, round
        // DO NOT USE: see update below
        var sin = b/scale;
        currentAngle = Math.round(Math.asin(sin) * (180/Math.PI));
    }
    
    return currentAngle;
};

/**
* Inheritance function
*
*/
Function.prototype.inheritsFrom = function (parentClassOrObject){ 
	if (parentClassOrObject.constructor == Function) 
	{ 
		//Normal Inheritance 
		this.prototype = new parentClassOrObject();
		this.prototype.constructor = this;
		this.prototype.super = parentClassOrObject.prototype;
	} else { 
		//Pure Virtual Inheritance 
		this.prototype = parentClassOrObject;
		this.prototype.constructor = this;
		this.prototype.super = parentClassOrObject;
	}

	return this;
};

/**
* Bind the function to the current context
*
*/
Function.prototype.bind = Function.prototype.bind || function (context) {
	$.proxy(this, context);
};


/**
* Subscribe to the specific Publisher
*/
Function.prototype.subscribe = function (publisher, context) {
	var alreadyExist = false;
	var that = this;
	$.each(publisher.subscribers, function () {
		if (this === that) {
			alreadyExist = true;
		}
	});

	if (!alreadyExist) {
		publisher.subscribers.push({ handler: this, scope: context});
	}

	delete that;
	return this;
}

/**
* Unsubscribe to the specific Publisher
*/
Function.prototype.unsubscribe = function (publisher) {
	var that = this;
	publisher.subscribers.filter(function (el) {
		if (el !== that) {
			return el;
		}
	});

	delete that;
	return this;
}

/**
* Format the String
*
*/
String.prototype.format = function () {
	var args = arguments;
	return this.replace(/\{(\d+)\}/g, function (match, number) { 
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
};

/**
* Remove the element that match the condition function
*
*/
if ( !Array.prototype.filter ) {
	Array.prototype.filter = function(conditionFunction, thisObj) {
		var scope = thisObj || window;
		var a = [];
		for ( var i = 0, len = this.length; i < len; ++i ) {
			if ( !conditionFunction.call(scope, this[i], i, this) ) {
				continue;
			}
			a.push(this[i]);
		}

		return a;
	};
};