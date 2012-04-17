define(["deps/under"], function(underscore) {
    
    var _ = underscore._;

    return { 
        selection_sort: function(arr, step_callback) {
            for(var i = 0; i < arr.length; i++) {
                var val_in_slot = arr[i];
                var min_index = i;
                for(var j = i; j < arr.length; j++) {
                    if(arr[j] < arr[min_index]) {
                            min_index = j; 
                    }
                }
                arr[i] = arr[min_index];
                arr[min_index] = val_in_slot;
                if(step_callback) { step_callback(arr); }
            }
            return arr;
        }
    }
        
});