define(['lib/utilities'], function(utilities) {

    var Hadamard = {};

    var table = [];
    table[0] = [[1]];

    var hk = function(k) { 
        if(table[k] !== undefined) { 
            return table[k]; 
        } else {       
            var arr = utilities.generate_table(Math.pow(2,k), Math.pow(2,k), 0);
            var prev = hk(k - 1);
            for(var i = 0; i < prev.length; i++) {
                for(var j = 0; j < prev[0].length; j++) {
                    var elem = prev[i][j];
                    arr[i][j] = elem;
                    arr[i + prev.length][j] = elem;
                    arr[i][j + prev[0].length] = elem;
                    arr[i + prev.length][j + prev[0].length] = -elem;                    
                }
            }
            table[k] = arr;
            return arr;
        }
    }

    var by_column_vector = function(h, v) {
        var arr = utilities.generate_table(h.length, 1, 0);
        for(var i = 0; i < h.length; i++) {
            for(var j = 0; j < h[0].length; j++) {
                arr[i][0] = arr[i][0] + (h[i][j] * v[j]);
            }
        }
        return arr;
    }

    var hk_by_v = function(k, v) {
        if(k === 0) {
            return [[1 * v[0]]]; 
        } else {
            var v1 = v.slice(0, v.length / 2);
            var v2 = v.slice(v.length / 2);
            var htop = hk_by_v(k - 1, v1);
            var hbot = hk_by_v(k - 1, v2);
            var arr = utilities.generate_table(Math.pow(2,k), 1, 0);
            for(var i = 0; i < htop.length; i++) {      
                arr[i][0] = htop[i][0] + hbot[i][0];
                arr[i + htop.length][0] = htop[i][0] - hbot[i][0];
            }
            console.log(arr);
            return arr;
        }
    }

    Hadamard.hk = hk;
    Hadamard.by_column_vector = by_column_vector;
    Hadamard.hk_by_v = hk_by_v;

    return Hadamard;

});