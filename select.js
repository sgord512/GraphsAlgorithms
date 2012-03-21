var u = require('underscore');

var arr = [1,2,3,4,5,6,7,8,9]

var select = function(arr, k) { 
    var pivot = arr[Math.floor(Math.random() * arr.length)];
    var left_half = u.filter(arr, function(n) { return n < pivot; });
    var right_half = u.filter(arr, function(n) { return n > pivot; });
    var middle = u.filter(arr, function(n) { return n === pivot; });
    var l = left_half.length;
    if(k <= l) {
        return select(left_half, k);
    } else if(k > l + middle.length) {
        return select(right_half, k - (l + middle.length));
    } else {
        return u.first(middle);
    }
}
 
