define(['deps/under', 'lib/algorithms/sorting/quicksort', 'lib/algorithms/sorting/insertion', 'lib/algorithms/sorting/selection'], function(underscore, quicksort, insertion_sort, selection_sort) { 
    
    var _ = underscore._;

    return function(comparator) { 

        var comparison_function = function(f) { 
            if(f) {
                return f; 
            } else { 
                return function(a,b) { return a - b; } 
            }
        }

        var sorter = {};
        sorter.compare = comparison_function(comparator);

        sorter.quicksort =  function(arr) { return quicksort.quicksort(arr, this.compare); }

        sorter.insertion_sort = function(arr) { return insertion_sort.insertion_sort(arr, this.compare); }

        sorter.selection_sort = function(arr) { return selection_sort.selection_sort(arr, this.compare); }

        sorter.is_sorted = function(arr) { 
            for(var i = 0; i < arr.length - 1; i++) {
                var diff = this.compare(arr[i],arr[i + 1]);
                console.log(diff);
                if(diff > 0) { return false; }
            }
            return true;
        }

        return sorter;
    }
});