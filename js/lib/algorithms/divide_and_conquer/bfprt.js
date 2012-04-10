define(["lib/utilities", "deps/under", "lib/algorithms/randomized/select"], function(utilities, underscore, randomized_select) {
    
    var _ = underscore._;
    var select = randomized_select.select;

    var bfprt = function(arr, k) {
        if(!k) { k = Math.ceil(arr.length / 2); }
        if(k === 1 && arr.length === 1) {
            return arr[0];
        } else {
            var chunk_medians = find_chunk_medians(arr);
            var i = Math.ceil(chunk_medians.length / 2);
            var pivot = bfprt(chunk_medians, i);
            var partition = utilities.partition(arr, pivot);
            var left_half = partition[0];
            var middle = partition[1];
            var right_half = partition[2];
            var l = left_half.length;

            if(k <= l) {
                return bfprt(left_half, k);
            } else if(k > l + middle.length) {
                return bfprt(right_half, k - (l + middle.length));
            } else { 
                return _.first(middle);
            }
        }

    }

    var find_chunk_medians = function(arr) {
        var chunk_arr = utilities.split_into_chunks(arr, 5);
        var chunk_medians = _.map(chunk_arr, function(chunk) { 
            var sorted_chunk = sorted_copy(chunk);
            var k = Math.ceil(sorted_chunk.length / 2); 
            return sorted_chunk[k - 1];
        });
        return chunk_medians;
    }

    var sorted_copy = function(arr) {
        var sorted = [];
        for(var index = 0; index < arr.length; index++) {
            var curr = arr[index];
            var i = 0;
            var inserted = false;
            while(!inserted && i < sorted.length) {
                if(sorted[i] > curr) {
                    sorted.splice(i, 0, curr);
                    inserted = true;
                }
                i = i + 1;
            }
            if(!inserted) { sorted = sorted.concat([curr]); }
        }
        return sorted;
    }
   
    var tests = [
        [1,2,3,4,5,6,7,8,9,10],
        [1,2,3,4,5,5,5,8,9,10],
        [1,1,2,2,3,3,4,4,5,5]
    ]


    return { bfprt: bfprt, find_chunk_medians: find_chunk_medians, sorted_copy: sorted_copy, tests: tests };

});