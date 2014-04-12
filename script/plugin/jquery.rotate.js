$.fn.animateRotate = function(angle, currentAngle, duration, easing, complete) {
    return this.each(function() {
        var $elem = $(this);

        $({deg:currentAngle}).animate({deg: angle}, {
            duration: duration,
            easing: easing,
            step: function(now) {
                $elem.css({
                    transform: 'rotate(' + now + 'deg)'
                });
            },
            complete: complete
        });
    });
};