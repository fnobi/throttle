function throttle (fn, interval) {
    var isWaiting = false;

    var exec = function () {
        if (isWaiting) {
            return;
        }

        isWaiting = true;
        setTimeout(function () {
            isWaiting = false;
            fn();
        }, interval);
    };

    return exec;
}
