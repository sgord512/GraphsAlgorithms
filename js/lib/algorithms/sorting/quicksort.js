define(["deps/under"], function(underscore) {
    
    var _ = underscore._;

    return { 

        quicksort: function(arr) { 
            var qs = function(arr) {
                console.log(arr);
                if(arr.length <= 1) { return arr; }
                var pivot_index = Math.floor(Math.random() * arr.length);
                var pivot = arr[pivot_index];
                var left = []; 
                var middle = [];
                var right = [];
                var curr;
                while(curr = arr.shift()) {
                    if(curr < pivot) { left.unshift(curr); }
                    else if(curr > pivot) { right.unshift(curr); }
                    else { middle.unshift(curr); }
                }
                return qs(left).concat(middle.concat(qs(right)));
            }
            return qs(arr);
        },

        quicksort_in_place: function(arr, step_callback) {
            var qs = function(arr, start_index, end_index) {
                if(end_index <= start_index + 1) { return; }
                var pivot_index = Math.floor(Math.random() * (end_index - start_index)) + start_index;
                var pivot_value = arr[pivot_index];
                arr[pivot_index] = arr[end_index - 1];
                var left_index = start_index;
                var right_index = end_index - 2;
                while(left_index < right_index) {
                    var left_value = arr[left_index];
                    var right_value = arr[right_index];
                    if(left_value > pivot_value && right_value < pivot_value) {
                        arr[left_index] = right_value;
                        arr[right_index] = left_value;
                        if(step_callback) { step_callback(arr, pivot_index); }
                        left_index++;
                        right_index--;
                    } else {
                        if(left_value <= pivot_value) { left_index++; }
                        if(right_value >= pivot_value) { right_index--; }                        
                    }                    
                }
                if(arr[left_index] > pivot_value) {
                    arr[end_index - 1] = arr[left_index];
                    arr[left_index] = pivot_value;
                } else {
                    arr[end_index - 1] = arr[left_index + 1];
                    arr[left_index + 1] = pivot_value;
                }
                qs(arr, start_index, left_index);
                qs(arr, left_index + 1, end_index);
            }
            qs(arr, 0, arr.length);
            return arr;
        }

    }
        
});