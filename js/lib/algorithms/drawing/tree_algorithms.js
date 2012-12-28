define(['deps/under', 'lib/data_structures/binary_tree'], function(underscore, bt) {
    
    var _ = underscore._;
    var node = bt.node;

    var position_lookup = function(tree) {
        var positions = {};
        _.each(bt.nodes_in_order(tree), function(node) { positions[node.id] = { x: node.x, y: node.y }; });
        return positions;
    };        

    var algorithms = {

        // Knuth's super-wide algorithm
        knuth_layered_wide: function(tree) {
            var table = {};
            var counter = 0;

            var compute_position = function(node, depth) {
                node.x = counter;
                node.y = depth;
                counter = counter + 1;
            };
            
            var traverse = function(node, depth) {
                if(node.is_leaf()) {
                    compute_position(node, depth);
                } else {
                    if(node.left) { traverse(node.left, depth + 1); }
                    compute_position(node, depth);
                    if(node.right) { traverse(node.right, depth + 1); }
                }
                
            };

            traverse(tree, 0);
            return position_lookup(tree);

        },

        // Minimum-width algorithm
        minimum_width: function(tree) {
            var table = {};
            var counter_table = {};

            var compute_position = function(node, depth) {
                if(!counter_table[depth]) { counter_table[depth] = 0; }
                node.x = counter_table[depth];
                node.y = depth;
                counter_table[depth] = counter_table[depth] + 1;
            };
            
            var traverse = function(node, depth) {
                if(node.is_leaf()) {
                    compute_position(node, depth);
                } else {
                    if(node.left) { traverse(node.left, depth + 1); }
                    if(node.right) { traverse(node.right, depth + 1); }
                    compute_position(node, depth);
                }
                
            };

            traverse(tree, 0);
            return position_lookup(tree);

        },

        third_algorithm: function(tree) {
            var next_pos_on_level = {};
            var last_shift_on_level = {};
            var max_height = tree.height();
            var modifier_sum = 0;
            
            var initial_position = function(node, depth) {
                if(!next_pos_on_level[depth]) { next_pos_on_level[depth] = 0; };
                if(!last_shift_on_level[depth]) { last_shift_on_level[depth] = 0; };
                node.y = depth;
                if(node.is_leaf()) { 
                    node.place = next_pos_on_level[depth];
                } else if(!node.left) { 
                    node.place = node.right.x - 1;
                } else if(!node.right) { 
                    node.place = node.left.x + 1;
                } else {
                    node.place = Math.floor((node.left.x + node.right.x) / 2);
                }
                if(node.is_leaf()) {
                    node.x = node.place;
                    next_pos_on_level[depth] = node.x + 2;
                    node.amount_shifted = 0;
                } else {
                    var diff = next_pos_on_level[depth] - node.place;
                    if(diff > 0) {
                        node.amount_shifted = diff;
                        node.x = next_pos_on_level[depth];
                    } else {
                        node.amount_shifted = 0;
                        node.x = node.place;
                    }
                    next_pos_on_level[depth] = node.x + 2;                    
                }
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
                var last_shift = last_shift_on_level[depth];
                if(node.is_leaf()) { last_shift = 0; }
                var total_modifier = Math.max(modifier_sum, last_shift);
                node.x = node.x + total_modifier;
                last_shift_on_level[depth] = total_modifier;
                modifier_sum = modifier_sum + node.amount_shifted;
              
            };

            var adjustment_traverse = function(node, depth) {
                if(node.is_leaf()) {
                    final_position(node, depth);
                } else {                
                    final_position(node, depth);
                    if(node.left) {
                        adjustment_traverse(node.left, depth + 1); 
                    } if(node.right) { 
                        adjustment_traverse(node.right, depth + 1); 
                    }
                    modifier_sum = modifier_sum - node.amount_shifted;
                }
                
            };

            initial_traverse(tree, 0);
            adjustment_traverse(tree, 0);
            return position_lookup(tree);
        },

        // Tilford-Reingold algorithm
        tilford_reingold: function(tree) { 

            var contour = function(tree) { 
                var contour_array = [];
                var height = tree.height();
                _.each(_.range(0, height + 1), function(level) { contour_array[level] = { left: undefined, right: undefined }; });
                var offset = 0;
                
                var record_in_contour_array = function(level, curr_offset) {
                    var level_bound = contour_array[level];
                    if(_.isUndefined(level_bound.left) || level_bound.left > curr_offset) { 
                        level_bound.left = curr_offset;
                    }
                    if(_.isUndefined(level_bound.right) || level_bound.right < curr_offset) { 
                        level_bound.right = curr_offset;
                    }
                };
                    
                var contour_helper = function(node, depth, curr_offset) {
                    record_in_contour_array(depth, curr_offset);
                    if(!_.isUndefined(node.left)) { contour_helper(node.left, depth + 1, curr_offset - 1); }
                    if(!_.isUndefined(node.right)) { contour_helper(node.right, depth + 1, curr_offset + 1); }
                };

                contour_helper(tree, 0, 0);
                return contour_array;
                
            };

            var spaced_tree = function(tree) {
                var min_separation_distance = function(left_node, right_node) { 
                    var left_contour = contour(left_node);
                    var right_contour = contour(right_node);

                    var inner_edge_l = _.pluck(left_contour, 'right');
                    var inner_edge_r = _.pluck(right_contour, 'left');

                    var longer_contour = _.max([inner_edge_l.length, inner_edge_r.length]);
                    var shorter_contour = _.min([inner_edge_l.length, inner_edge_r.length]);

                    var differences = _.map(_.range(shorter_contour), function(i) {
                        var inner_l = inner_edge_l[i] || 0;
                        var inner_r = inner_edge_r[i] || 0;
                        return inner_l - inner_r + 1;
                    });

                    return _.max(differences);
                };

                var first_whole_separation = function(x) { return Math.ceil(x / 2); };

                var minimum_subtree_separation = function(node) {
                    if(!node.is_leaf()) {
                        if(!node.left || !node.right) { 
                            return 1;
                        } else { 
                            return min_separation_distance(node.left, node.right);
                        }
                    }
                    else { return undefined; }
                };

                var new_left;
                if(!_.isUndefined(tree.left)) { new_left = spaced_tree(tree.left); }
                var new_right; 
                if(!_.isUndefined(tree.right)) { new_right = spaced_tree(tree.right); }
                var subtree_spacing; 
                var min_sub_sep = minimum_subtree_separation(tree);
                if(!_.isUndefined(min_sub_sep)) { subtree_spacing = first_whole_separation(min_sub_sep); }

                tree.left = new_left;
                tree.right = new_right;
                tree.subtree_spacing = subtree_spacing;

                return tree;
            };

            var coordinates_from_spacing = function(tree) {
                var cfs = function(level, curr_x, tree) { 
                    var spacing = tree.subtree_spacing;
                    var next_level = level + 1;
                    var new_left;
                    var new_right;
                    if(!_.isUndefined(spacing)) { 
                        if(!_.isUndefined(tree.left)) { 
                            new_left = cfs(next_level, curr_x - spacing, tree.left);
                        }
                        if(!_.isUndefined(tree.right)) { 
                            new_right = cfs(next_level, curr_x + spacing, tree.right);
                        }
                    }
                    var tree_x = curr_x;
                    var tree_y = level;
                    tree.left = new_left;
                    tree.right = new_right;
                    tree.x = tree_x;
                    tree.y = tree_y;

                    return tree;
                };

                var coord_tree = cfs(0, 0, tree);
                var leftmost_x = _.min(_.pluck(bt.nodes_in_order(coord_tree), 'x'));
                tree.tree_map(function(node) { 
                    node.x = node.x - leftmost_x;
                    return node;
                });

                return tree;
            };

            var coord_tree = coordinates_from_spacing(spaced_tree(tree));
            return position_lookup(coord_tree);    
        }
                    
    };
    
    return { algorithms: algorithms, nodes_in_order: bt.nodes_in_order };
});