define(['lib/utilities', 'deps/under'], function(utilities, underscore) {

    var _ = underscore._;

    var Z = [1,-2,2,3,-1]

    var A = [[1,1],[0,1]]
    var B = [[0,1],[1,1]]
    var C = [[1,0],[1,1]]
    var D = [[1,1],[1,1]]
    var E = [[1,0],[1,0]]
    var F = [[1,1],[0,0]]
    var G = [[0,1],[0,1]]
    var H = [[0,0],[1,1]]

    var compute_all_sums = function(z) {
        var sets = [[]];
        for(var i = 0; i < z.length; i++) {
            sets = _.flatten(_.map(sets, function(s) {
                return [s.concat([0]), s.concat([1])]; 
            }), true);
        }        
        return _.map(sets, function(s) { 
            var sum = 0; 
            _.each(z, function(zi, i) { 
                sum = sum + s[i] * zi;
            });
            return { set: s.join(""), sum: sum };
        });
    }

    var square_matrix_multiply = function(a, b) {
        var c = [];
        for(var i = 0; i < a.length; i++) {
            c[i] = [];
            for(var j = 0; j < a[i].length; j++) {
                c[i][j] = 0;
                for(var k = 0; k < a[i].length; k++) {
                    c[i][j] = c[i][j] + a[i][k] * b[k][j];
                }
            }
        }
        return c;
    }

    var matrix_by_vector = function(a, v) {
        var b = [];
        for(var i = 0; i < v.length; i++) {
            b[i] = 0;
            for(var j = 0; j < v.length; j++) {
                b[i] = b[i] + a[i][j] * v[j];
            }
        }
        return b;
    }

    var equals = function(a, b) {
        for(var i = 0; i < a.length; i++) {
            if(a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    }

    var verify = function(A, B, C, D) {
        var r = [];
        for(var i = 0; i < A.length; i++) {
            r[i] = (Math.random() < .5) ? 0 : 1;
        }
        var b = matrix_by_vector(B, r);
        var d = matrix_by_vector(D, r);
        
        var a = matrix_by_vector(A, b);
        var c = matrix_by_vector(C, d);

//        console.log("[" + a + "] equals [" + c + "]? " + equals(a,c));

        return equals(a,c);
    }

    var monte_carlo_verify = function(A, B, C, D) {
        var prob = 1/2;
        var prob_false_positive = 1;
        var equal = true;
        while(prob_false_positive > .01) {
            equal = equal && verify(A, B, C, D);
            prob_false_positive = prob_false_positive * prob;
//            console.log("probability that algorithm incorrectly says AB = CD: " + prob_false_positive);
        }
        return equal;
    }

    return { A: A,
             B: B,
             C: C,
             D: D,
             E: E,
             F: F, 
             G: G,
             H: H,
             Z: Z,
             m_m: square_matrix_multiply,
             m_v: matrix_by_vector,
             verify: verify,
             equals: equals,
             monte_carlo_verify: monte_carlo_verify,
             sums: compute_all_sums 
           };

});