// check if a element is scrollable

export function isScrollable(element) {
    let origin_value = element.scrollTop;
    if (element.scrollTop > 0) return true;
    element.scrollTop = 1;
    if (element.scrollTop == 1) {
        element.scrollTop = origin_value;
        return true;
    }
    return false;
}

// throttle

export function throttle(func, wait, interval) {
    var delayed,
        lastExcTime = new Date();
    return function() {
        var ctx = this,
            args = arguments,
            curTime = new Date();
        delayed && clearTimeout(delayed);
        if ((new Date() - lastExcTime) >= interval) {
            func.apply(ctx, args);
            lastExcTime = new Date();
        } else {
            delayed = setTimeout(func, wait);
        }        
    };
}

// 
