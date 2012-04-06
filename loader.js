var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'js',
    nodeRequire: require,
});

var lib = requirejs('lib/algorithms/drawing/tree_algorithms');