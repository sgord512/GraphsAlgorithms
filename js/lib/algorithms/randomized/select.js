define(["lib/utilities", "deps/under"], function(utilities, underscore) {

    var _ = underscore._;

    var select = function(arr, k) { 
        if(k === 0) { throw new Error("k must be at least 1"); }
        if(k === 1 && arr.length === 1) { return arr[0]; }
        var pivot = arr[Math.floor(Math.random() * arr.length)];
        var partition = utilities.partition(arr, pivot);
        var left_half = partition[0];
        var middle = partition[1];
        var right_half = partition[2];
        var l = left_half.length;
        if(k <= l) {
            return select(left_half, k);
        } else if(k > l + middle.length) {
            return select(right_half, k - (l + middle.length));
        } else {
            return _.first(middle);
        }
    }
    
    return { select: select }
});