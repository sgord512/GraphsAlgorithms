define(["lib/utilities", "deps/under"], function(utilities, underscore) {

    var examples = { first: ['X','X','X','X','X','Y'],
                 second: ['X','Y','X','Y','X','Y'],
                 third: ['X','Y','X','Y','Y'],
                 fourth: ['Y','Y','X']
               }

    var _ = underscore._;

    var halve_arr = function(arr) { 
        var pairs = Math.floor(arr.length / 2);
        var halved_arr = [];
        var i = 0;
        while(i < pairs) {
            if(arr[2*i] === arr[2*i + 1]) {
                halved_arr.push(arr[2*i]);
            }
            i = i + 1;
        }
        var next_index = 2*i;
        if(arr.length - next_index >= 1) {
            halved_arr.push(arr[next_index]);
        }
        return halved_arr;
    }
            
    var majority_possibilities = function(arr) { 
        var result_arr = arr;
        while(result_arr.length > 3) {
            result_arr = halve_arr(result_arr);
        }
        return result_arr;
    }

    var majority_element = function(arr) {
        var possibilities = majority_possibilities(arr);
        var counter = {};
        _.each(possibilities, function(p) {
            counter[p] = 0; 
        });
        for(var i = 0; i < arr.length; i++) {
            var element = arr[i];
            if(counter[element] !== undefined) {
                counter[element] = counter[element] + 1;
            }
        }
        return _.find(_.keys(counter), function(k) {
            return counter[k] > arr.length / 2;
        });
    }
    
    return { halve_arr: halve_arr,
             majority_possibilities: majority_possibilities,
             majority_element: majority_element
           }
    
});