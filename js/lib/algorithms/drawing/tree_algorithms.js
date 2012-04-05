define(['deps/underscore', 'lib/data_structures/binary_tree'], function(underscore, bt) {
    
    var _ = underscore._;
    var BinaryTree = bt.BinaryTree;
    var Leaf = bt.Leaf;

    var knuth_layered_wide = function(node) {
        var table = {}
        var counter = 0;

        var current_position = function(node, depth) {
            table[node.id] = { x: counter, y: depth };
            counter = counter + 1;
        }
        
        var _compute_position = function(node, depth) {
            if(depth === undefined) { depth = 0; }
            if(node instanceof BinaryTree) {
                if(node.left !== undefined) { _compute_position(node.left, depth + 1); }
                current_position(node, depth);
                if(node.right !== undefined) { _compute_position(node.right, depth + 1); }
            }
            else if(node instanceof Leaf) {
                current_position(node, depth);
            }
            return table;
        }
        return _compute_position;

    };

    var minimum_width = function(node) {
        var table = {}
        var counter_table = {};

        var current_position = function(node, depth) {
            if(_.isUndefined(counter_table[depth])) { counter_table[depth] = 0; }
            table[node.id] = { x: counter_table[depth], y: depth };
            counter_table[depth] = counter_table[depth] + 1;
        }
        
        var _compute_position = function(node, depth) {
            if(depth === undefined) { depth = 0; }
            if(node instanceof BinaryTree) {
                if(node.left !== undefined) { _compute_position(node.left, depth + 1); }
                if(node.right !== undefined) { _compute_position(node.right, depth + 1); }
                current_position(node, depth);
            }
            else if(node instanceof Leaf) {
                current_position(node, depth);
            }
            return table;
        }
        return _compute_position;

    };

    var example_tree = new BinaryTree(new Leaf(), new BinaryTree(new BinaryTree(new BinaryTree(new Leaf(), undefined), undefined), undefined));
    var example_tree2 = new BinaryTree(new BinaryTree(new Leaf(), new Leaf()), new BinaryTree(new Leaf(), new Leaf()));
    var example_tree3 = new BinaryTree(new BinaryTree(new BinaryTree(new BinaryTree(new BinaryTree(new Leaf(), new Leaf()), new Leaf()), new Leaf()), new Leaf()), new BinaryTree(new BinaryTree(new Leaf(), new Leaf()), new Leaf()));

    var algorithm = {}
    algorithm.algorithms = { knuth_layered_wide: function() { return knuth_layered_wide(); }
                            ,minimum_width: function() { return minimum_width(); } 
                           };

    algorithm.example_tree = example_tree;
    algorithm.example_tree2 = example_tree2;
    algorithm.example_tree3 = example_tree3;
    algorithm.nodes_in_order = bt.nodes_in_order

    return algorithm;
});