define(['deps/under', 'lib/utilities'], function(underscore, utilities) {

    var _ = underscore._;

    var iteration = function(z, x) { 
        return z - ((Math.pow(z, 2) - x) / (2 * z));
    }

    return function(z) {
        return function(x) {
            return {
                gather_n_iterations: function(n) {
                    var arr = [];
                    arr[0] = z;
                    for(var i = 1; i <= n; i++) {
                        arr[i] = iteration(arr[i - 1], x);
                        
                    }
                    return arr;
                }
            }
        }
    }

});