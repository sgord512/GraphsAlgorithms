define(['lib/utilities', 'deps/under'], function(utilities, underscore) {
    
    var _ = underscore._;

    return {

        regular_n_gon: function(n, radius) {
            if(n <= 2) { throw new Error("n must be greater than 2"); }
            else {
                var points = [];
                for(var i = 0; i < n; i++) {
                    var angle = (i / n) * 2 * Math.PI;
                    var x = radius * Math.sin(angle);
                    var y = radius * Math.cos(angle);
                    points[i] = [x,y];
                }
                return points.reverse();
            }
        },

        reflect_around_1: function(arr) {
            var reflection = _.map(arr, _.identity);
            var pairs_to_swap = Math.ceil((reflection.length - 1) / 2);
            var swap_vertices = function(i, j) {
                var temp = reflection[i];
                reflection[i] = reflection[j];
                reflection[j] = temp;
            }
            var start = _.indexOf(reflection, 1);
            var left_index = start;
            var right_index = start;
            for(var swaps = 0; swaps < pairs_to_swap; swaps++) {
                if(left_index - 1 < 0) { 
                    left_index = reflection.length - 1;
                } else { 
                    left_index = left_index - 1; 
                }
                if(right_index + 1 >= reflection.length) {
                    right_index = 0;
                } else {
                    right_index = right_index + 1;
                }
                
                swap_vertices(left_index, right_index);
            }

            return reflection;
        },

        rotate_one_nth: function(arr) {
            var reflection = _.map(arr, _.identity);
            reflection.unshift(reflection.pop());
            return reflection;
        }
            

    }

});