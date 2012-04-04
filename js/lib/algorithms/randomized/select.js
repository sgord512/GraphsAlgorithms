define([], function() {

var u = require('underscore');

var arr = [1,2,3,4,5,6,7,8,9,10]
var arr2 = [1,2,3,4,5,5,5,8,9,10]
var arr3 = [1,1,2,2,3,3,4,4,5,5]

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
 
var contains_k_elements = function(arr, k) {
    if(arr.length < k) { return false; }
    var median = select(arr, Math.floor(arr.length / 2)); // This should actually use deterministic linear time median-find, but that is a little too involved to code up at the time being
    var left_half = u.filter(arr, function(n) { return n < median; });
    var right_half = u.filter(arr, function(n) { return n > median; });
    var middle = u.filter(arr, function(n) { return n === median; });
    if(middle.length >= k) { 
        return true;
    }
    else {
        return (contains_k_elements(left_half, k)) || (contains_k_elements(right_half, k));
    }
}


// This is unfinished for the time being.
//var deterministic_median_find = function(arr) { 
//    var visited = {}
//    for(var i = 0; i < arr.length; i++) {
//        var curr = arr[i];
//        if(u.isUndefined(visited[curr]
//    }
//
//}
//

});