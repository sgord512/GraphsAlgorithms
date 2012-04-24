var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'js',
    nodeRequire: require,
});

var lib = requirejs('lib/algorithms/linear_programming/ta_hours')

var result = lib.as_flow_network(lib.examples.first);
