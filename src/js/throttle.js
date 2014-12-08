function throttle (fn, interval) {
    var isWaiting = false;

    var exec = function (event) {
        if (isWaiting) {
            return;
        }

        isWaiting = true;
        setTimeout(function () {
            isWaiting = false;
            fn(event);
        }, interval);
    };

    return exec;
}
