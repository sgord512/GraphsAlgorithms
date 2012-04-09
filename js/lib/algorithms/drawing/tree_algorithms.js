define(['deps/under', 'lib/data_structures/binary_tree'], function(underscore, bt) {
    
    var _ = underscore._;
    var node = bt.node;

    var position_lookup = function(tree) {
        var positions = {};
        _.each(bt.nodes_in_order(tree), function(node) { positions[node.id] = { x: node.x, y: node.y } });
        return positions;
    }        

    var algorithms = {
        knuth_layered_wide: function(tree) {
            var table = {}
            var counter = 0;

            var compute_position = function(node, depth) {
                node.x = counter;
                node.y = depth;
                counter = counter + 1;
            }
            
            var traverse = function(node, depth) {
                if(node.is_leaf()) {
                    compute_position(node, depth);
                } else {
                    if(node.left) { traverse(node.left, depth + 1); }
                    compute_position(node, depth);
                    if(node.right) { traverse(node.right, depth + 1); }
                }
                
            }

            traverse(tree, 0);
            return position_lookup(tree);

        },

        minimum_width: function(tree) {
            var table = {}
            var counter_table = {};

            var compute_position = function(node, depth) {
                if(!counter_table[depth]) { counter_table[depth] = 0; }
                node.x = counter_table[depth];
                node.y = depth;
                counter_table[depth] = counter_table[depth] + 1;
            }
            
            var traverse = function(node, depth) {
                if(node.is_leaf()) {
                    compute_position(node, depth);
                } else {
                    if(node.left) { traverse(node.left, depth + 1); }
                    if(node.right) { traverse(node.right, depth + 1); }
                    compute_position(node, depth);
                }
                
            }
            traverse(tree, 0);
            return position_lookup(tree);

        },

        third_algorithm: function(tree) {
            var next_pos_on_level = {};

            var max_height = tree.height();

            var initial_position = function(node, depth) {
                if(!next_pos_on_level[depth]) { next_pos_on_level[depth] = 0; };
                node.y = depth;
                if(node.is_leaf()) { 
                    node.place = next_pos_on_level[depth];
                } else if(!node.left) { 
                    node.place = node.right.x - 1;
                } else if(!node.right) { 
                    node.place = node.left.x + 1;
                } else {
                    node.place = ((node.left.x + node.right.x) / 2);
                }
                if(node.is_leaf()) {
                    node.x = node.place;
                    next_pos_on_level[depth] = node.x + 2;
                } else {
                    node.x = node.place;
                    var diff = next_pos_on_level[depth] - node.place;
                    if(diff >= 0) { shift(node, diff, depth); }
                    next_pos_on_level[depth] = node.x + 2;
                }

                console.log("Next positions");
                console.log(next_pos_on_level);
            };

            var shift = function(node, n, depth) {
                node.x = node.x + n;

                if(node.left) { shift(node.left, n, depth + 1); }
                if(node.right) { shift(node.right, n, depth + 1); }
            };
                          
            var initial_traverse = function(node, depth) {
                if(node.is_leaf()) {
                    initial_position(node, depth);
                } else {
                    if(node.left) { initial_traverse(node.left, depth + 1); }
                    if(node.right) { initial_traverse(node.right, depth + 1); }
                    initial_position(node, depth);
                }
              
            };

            var final_position = function(node, depth) {
                node.x = node.x + modifier_sum;
                modifier_sum = modifier_sum + node.modifier;
            };

            var adjustment_traverse = function(node, depth) {
                if(node.is_leaf()) {
                    final_position(node, depth);
                } else {                
                    final_position(node, depth);
                    if(node.left) { adjustment_traverse(node.left, depth + 1); }
                    if(node.right) { 
                        modifier_sum = modifier_sum - node.right.modifier;
                        adjustment_traverse(node.right, depth + 1); }
                }
                
            };

            initial_traverse(tree, 0);
     //       console.log("Next positions");
       //     console.log(next_pos_on_level);
//            console.log(bt.nodes_in_order(tree));
  //          adjustment_traverse(tree, 0);
            return position_lookup(tree);
        }
    }
    
    return { algorithms: algorithms, nodes_in_order: bt.nodes_in_order };
});