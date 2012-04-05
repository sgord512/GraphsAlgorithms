var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'js',
    nodeRequire: require,
});

var lib = requirejs('lib/visualizations/tree_visualization');