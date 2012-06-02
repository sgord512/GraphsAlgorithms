var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'js',
    nodeRequire: require,
});

var u = requirejs('lib/utilities');
var under = requirejs('deps/under');

var hilbert = requirejs('lib/miscellaneous/graphics_2d/hilbert');