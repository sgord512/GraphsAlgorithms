var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'js',
    nodeRequire: require,
});

var u = requirejs('lib/utilities');

// var fib = function(n) {
//     if(n === 1 || n === 2) {
//         return 1;
//     } else { 
//         return fib(n-1) + fib(n-2);
//     }
// }

var QuaternionGroup = requirejs('lib/miscellaneous/groups/quaternion_group');

var q = new QuaternionGroup();

