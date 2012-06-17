var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'js',
    nodeRequire: require,
});

var u = requirejs('lib/utilities');
var under = requirejs('deps/under');

var Sudoku = requirejs('lib/miscellaneous/sudoku/sudoku');

var s = new Sudoku();

s.fill_board();