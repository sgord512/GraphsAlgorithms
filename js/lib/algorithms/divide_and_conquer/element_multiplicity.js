define(["lib/utilities", "lib/algorithms/divide_and_conquer/bfprt"], function(bfprt) {

    var contains_k_elements = function(arr, k) {
        if(arr.length < k) { return false; }
        var median = bfprt(arr, Math.floor(arr.length / 2));
        var partition = utilities.partition(arr, median);
        var left_half = partition[0];
        var middle = partition[1];
        var right_half = partition[2];
        if(middle.length >= k) { 
            return true;
        }
        else {
            return (contains_k_elements(left_half, k)) || (contains_k_elements(right_half, k));
        }
    }

});