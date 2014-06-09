# throttle
===============

basic function throttle.

## install

```
bower install throttle
```

## usage

```javascript
// exec on resize function once in every seconds
$(window).on('resize', throttle(function () {
    onResize();
}, 1000));


```