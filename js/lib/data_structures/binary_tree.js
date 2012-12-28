define(['lib/utilities', 'deps/under'], function(utilities, underscore) {
    
    var _ = underscore._;

    var generator = utilities.id_generator();

    var node = function() {
        var bt = utilities.inherit(methods);
        bt.id = generator();
        if(arguments.length === 2) {
            bt.left = arguments[0];
            bt.right = arguments[1];
        }
        else if(arguments.length === 0) {
            bt.left = undefined;
            bt.right = undefined;
        }
        else throw new Error("Either 0 or 2 arguments allowed for this function, but called with: " + arguments.length);
        return bt;
    }

    var methods = { 
        height: function() {
            if(this.is_leaf()) { 
                return 0; 
            } else {
                var children = [];
                if(!_.isUndefined(this.left)) { children.unshift(this.left.height()); }
                if(!_.isUndefined(this.right)) { children.unshift(this.right.height()); }
                return 1 + _.max(children);
            }
        },

        is_leaf: function() { 
            return _.isUndefined(this.left) && _.isUndefined(this.right);
        },

        tree_map: function(f) { 
            var new_left;
            if(!_.isUndefined(this.left)) { new_left = this.left.tree_map(f); }
            var new_right;
            if(!_.isUndefined(this.right)) { new_right = this.right.tree_map(f); }
            var new_this = f(this);

            new_this.left = new_left;
            new_this.right = new_right;
            
            return new_this;
        }

    }

    var nodes_in_order = function(node) {
        if(node.is_leaf()) { return [node]; }
        else {
            var list = []
            if(node.left) { list = list.concat(nodes_in_order(node.left)); }
            list = list.concat([node]);
            if(node.right) { list = list.concat(nodes_in_order(node.right)); }
            return list;
        }
    }

    return { node: node, nodes_in_order: nodes_in_order };

});