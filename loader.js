var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'js',
    nodeRequire: require,
});

var u = requirejs('lib/utilities');
var under = requirejs('deps/under');

// var fib = function(n) {
//     if(n === 1 || n === 2) {
//         return 1;
//     } else { 
//         return fib(n-1) + fib(n-2);
//     }
// }

var n = 3;

var lib = requirejs('lib/miscellaneous/groups/symmetric_group');



var sym, e;

var again = function() { 
    sym = new lib.SymmetricGroup(n);
    e = sym.elements;
    sym.print_group();
}

again();

var cc = lib.compare_cycles;
var cp = lib.compare_permutations;

var sorts = requirejs('lib/algorithms/sorting/sorts')(lib.compare_permutations);

