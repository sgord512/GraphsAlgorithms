define(['deps/under', 'lib/data_structures/binary_tree'], function(underscore, bt) {
    
    var _ = underscore._;
    var BinaryTree = bt.BinaryTree;
    var Leaf = bt.Leaf;

    var knuth_layered_wide = function() {
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

    var minimum_width = function() {
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

    var third_algorithm = function() {
        var position_table = {}
        var next_pos_on_level = {};
        var modifier_table = {};
        var next_modifier_on_level = {}
        var modifier_sum = 0;

        var current_position = function(node, depth) {
            if(_.isUndefined(next_pos_on_level[depth])) { next_pos_on_level[depth] = 0; };
            if(_.isUndefined(next_modifier_on_level[depth])) { next_modifier_on_level[depth] = 0; };
            if(node instanceof Leaf) { 
                position_table[node.id] = { x: next_pos_on_level[depth], y: depth };
            } else if(node.left === undefined) { 
                position_table[node.id] = { x: position_table[node.right.id].x - 1, y: depth };
            } else if(node.right === undefined) { 
                position_table[node.id] = { x: position_table[node.left.id].x + 1, y: depth };
            } else {
                position_table[node.id] = { x: Math.floor((position_table[node.left.id].x + position_table[node.right.id]) / 2), y: depth };
            }
            next_modifier_on_level[depth] = Math.max(next_modifier_on_level[depth], next_pos_on_level[depth] - position_table[node.id]);
            if(node instanceof Leaf) {
                position_table[node.id] = { x: position_table[node.id].x, y: position_table[node.id].y } 
            } else {
                position_table[node.id] = { x: position_table[node.id].x + next_modifier_on_level[depth], y: position_table[node.id].y };
            }
            next_pos_on_level[depth] = next_pos_on_level[depth] + 2;
            modifier_table = next_modifier_on_level[depth];
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
            return position_table;
        }

        var current_position2 = function(node, depth) {
            position_table[node.id] = { x: position_table[node.id].x + modifier_sum, y: depth };
            modifier_sum  = modifier_sum + modifier_table[node.id];
        }

        var _adjust_position = function(node, depth) {
            if(depth === undefined) { depth = 0; }
            if(node instanceof BinaryTree) {                
                current_position2(node, depth);
                if(node.left !== undefined) { _adjust_position(node.left, depth + 1); }
                modifier_sum = modifier_sum - modifier_table[node.id]
                if(node.right !== undefined) { _adjust_position(node.right, depth + 1); }
            }
            else if(node instanceof Leaf) {
                current_position2(node, depth);
            }
            return position_table;
        }

        return function(node) {
            _compute_position(node, 0);
            _adjust_position(node, 0);
            return position_table;
        }

    };

    var example_tree = new BinaryTree(new Leaf(), new BinaryTree(new BinaryTree(new BinaryTree(new Leaf(), undefined), undefined), undefined));
    var example_tree2 = new BinaryTree(new BinaryTree(), new BinaryTree());
    var example_tree3 = new BinaryTree(new BinaryTree(new BinaryTree(new BinaryTree(new BinaryTree(), new Leaf()), new Leaf()), new Leaf()), new BinaryTree(new BinaryTree(), new Leaf()));
    var example_tree4 = new BinaryTree(new BinaryTree(new Leaf(), new BinaryTree()), new BinaryTree(undefined, new BinaryTree(undefined, new BinaryTree(new BinaryTree(new BinaryTree(new BinaryTree(), new Leaf()), new Leaf()), undefined))));

    var algorithm = {}
    algorithm.algorithms = { knuth_layered_wide: function() { return knuth_layered_wide(); }
                            ,minimum_width: function() { return minimum_width(); } 
                            ,third_algorithm: function() { return third_algorithm(); }
                           };

    algorithm.example_tree = example_tree;
    algorithm.example_tree2 = example_tree2;
    algorithm.example_tree3 = example_tree3;
    algorithm.example_tree4 = example_tree4;
    algorithm.nodes_in_order = bt.nodes_in_order

    return algorithm;
});