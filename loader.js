var fs = require('fs');

var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'js',
    nodeRequire: require,
    paths: { 'coffee-script': 'deps/coffee-script' }
});

var u = requirejs('lib/utilities');
var under = requirejs('deps/under');

var p = requirejs('cs!lib/visualizations/turing_machine/turing_parser');
var builder = requirejs('cs!lib/visualizations/turing_machine/turing_builder');


var tm = fs.readFileSync('../../haskell/turing/tests/move_left3.tm', 'utf8');
var tm2 = fs.readFileSync('../../haskell/turing/tests/add.tm', 'utf8');

var t = p.parseTM(tm)
var t2 = p.parseTM(tm2)

t.rules[0].delta.action.show()

