var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'js',
    nodeRequire: require,
});

var u = requirejs('lib/utilities');
var under = requirejs('deps/under');

var Sudoku = requirejs('lib/miscellaneous/sudoku');

var s = new Sudoku();

s.setSquare(2,5,7);
s.setSquare(3,4,1);
s.print();

console.log(under.pluck(s.getCol(2), 'constraints'));
console.log(under.pluck(s.getRow(5), 'constraints'));
console.log(under.pluck(s.getBox(2, 5), 'constraints'));