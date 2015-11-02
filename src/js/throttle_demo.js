// exec on resize function once in every seconds
$(window).on('resize', throttle(function (event) {
    onResize();
}, 1000));

