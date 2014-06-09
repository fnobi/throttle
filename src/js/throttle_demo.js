// exec on resize function once in every seconds
$(window).on('resize', throttle(function () {
    onResize();
}, 1000));

