define(["lib/utilities", "deps/under"], function(utilities, underscore) {

    var _ = underscore._;

    var majority_element = function(arr) { 
        while(arr.length > 1) {
            
            if(arr.length % 2 === 1) {
                var odd_element = arr[0];
                if(check_element(odd_element, arr)) { return odd_element; }
                else { arr.shift(); }
            }
            var halved_arr = [];
            var i = 0;
            while(i + 1 < arr.length) {
                if(arr[i] === arr[i + 1]) {
                    halved_arr.push(arr[i]);
                }
                i = i + 2;
            }
            arr = halved_arr;
        }
        return arr[0];
    }
    
    var check_element = function(e, arr) {
        return _.filter(arr, function(x) { return x === e; }).length > Math.floor(arr.length / 2);
    }

    return { majority_element: majority_element }
    
});