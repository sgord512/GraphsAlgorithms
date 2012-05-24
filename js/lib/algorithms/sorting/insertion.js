define(["deps/under"], function(underscore) {
    
    var _ = underscore._;

    return { 
        insertion_sort: function(arr, compare, step_callback) {
            for(var i = 0; i < arr.length; i++) {
                var ins = arr[i];
                var j = 0;
                var found = false;
                while(!found && j < i) {
                    if(compare(arr[j],ins) > 0) {
                        
                        for(var k = i; k > j; k--) {
                            arr[k] = arr[k - 1];
                        }
                        arr[j] = ins;
                        found = true;
                    }
                    else { 
                        j++;
                    }
                }
                if(step_callback) { step_callback(arr); }
            }
            return arr;
        }
    }
        
});