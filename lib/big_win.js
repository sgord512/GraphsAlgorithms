var u = require('underscore');

var list = [3,-2,-5,8,-4,1,6,-4,1]
var list2 = [3,-2,-5,8,-4,1,6,-4,1,-100,101,102,103]
var list3 = [3,-2,-5,8,-4,1,6,-4,1,-100,30,32,33]

var sum = function(arr) { 
    var s = 0;
    for(var i = 0; i < arr.length; i++) {
        s = s + arr[i];
    }
    return s;
}

var big_middle = function(list, lower_bound, upper_bound) {
    var mid = Math.floor(lower_bound + (upper_bound - lower_bound) / 2)

    var current_max = { i: mid
                      , j: mid
                      }

    var max_left = 0;

    for(var i = mid; i >= lower_bound; i--) {

        var arr = list.slice(i, mid);

        if(sum(arr) >= max_left) {
            max_left = sum(arr);
            current_max.i = i;
        }
    }
    
    var max_right = [mid];

    for(var j = mid; j < upper_bound; j++) {
        var arr = list.slice(mid, j);
        if(sum(arr) >= max_right) { 
            max_right = sum(arr);
            current_max.j = j;
        }
    }
    current_max.sum = sum(list.slice(current_max.i, current_max.j));
    return current_max;
}

var big_win = function(list, lower_bound, upper_bound) {
    var mid = lower_bound + Math.floor((upper_bound - lower_bound) / 2);
    var size = upper_bound - lower_bound;
    var current_max = {}

    if(size <= 1) {
        current_max.sum = list[lower_bound];
        current_max.i = lower_bound;
        current_max.j = upper_bound
        return current_max;
    }
    else {
        var left = big_win(list, lower_bound, mid);
        var middle = big_middle(list, lower_bound, upper_bound);
        var right = big_win(list, mid + 1, upper_bound);
        return u.max([middle, left, right], function(n) { return n.sum });
    }
}

var max_sequence = function(list) { 
    return big_win(list, 0, list.length + 1);
}