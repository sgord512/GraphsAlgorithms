var requirejs = require('requirejs');
requirejs.config({
    baseUrl: 'js',
    nodeRequire: require,
});

var SplayTree = requirejs('lib/data_structures/splay_tree');
var Set = requirejs('lib/data_structures/set')(SplayTree);

var st = new Set();

st.insert(1).insert(3).insert(2);

