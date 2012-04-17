var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'js',
    nodeRequire: require,
});

var lib = requirejs('lib/miscellaneous/elementary_automata');

var a = new lib({ x: 5, mode: 'toroidal', rules: 110 });