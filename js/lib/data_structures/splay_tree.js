define(["lib/utilities", "deps/under"], function(utilities, underscore) {

    var _ = underscore._;

    var Node = function(v, parent) {
        this.left = undefined;
        this.value = v;
        this.right = undefined;
        this.parent = parent;
    };

    Node.prototype.height = function() {
        if(this.left && this.right) { return Math.max(this.left.height(), this.right.height()) + 1; }
        else if(this.left) { return this.left.height() + 1; }
        else if(this.right) { return this.right.height() + 1; }
        else return 1;
    };

    Node.prototype.is_root = function() {
        return this.parent === undefined;
    };

    Node.prototype.is_left_child = function() {
        return this.parent.left === this;
    };

    Node.prototype.is_right_child = function() {
        return this.parent.right === this;
    };

    Node.prototype.is_leaf = function() {
        return !(this.right || this.left);
    };

    Node.prototype.remove_child = function(node) {
        if(this.left === node) { this.left = undefined; }
        else if(this.right === node) { this.right = undefined; }
    };

    var SplayTree = function(comparator) {
        this.comparator = comparator || function(a, b) { return a - b; };
        this.root = undefined;
    };

    SplayTree.prototype.height = function() {
        if(this.root) { return this.root.height(); }
        else return 0;
    };

    SplayTree.prototype.rotate_right = function(node) {
        var p = node.parent;
        var g = p.parent;
        var node_right = node.right;
        node.right = p;
        p.parent = node;
        p.left = node_right;
        node.parent = g;
        if(g) {
            if(g.left === p) {
                g.left = node;
            } else if(g.right === p) {
                g.right = node;
            }
        } else {
            this.root = node;
        }
    };

    SplayTree.prototype.rotate_left = function(node) {
        var p = node.parent;
        var g = p.parent;
        var node_left = node.right;
        node.left = p;
        p.parent = node;
        p.right = node_left;
        node.parent = g;
        if(g) {
            if(g.left === p) {
                g.left = node;
            } else if(g.right === p) {
                g.right = node;
            }
        } else {
            this.root = node;
        }
    };

    SplayTree.prototype.splay_to_root = function(node) {
        if(node) {
            while(!node.is_root()) {
                this.splay(node);
            }
        }
    };

    SplayTree.prototype.splay = function(node) {
        var p = node.parent;
        if(p && p.is_root()) {
            if(node.is_left_child()) {
                this.rotate_right(node);
            } else if(node.is_right_child()) {
                this.rotate_left(node);
            }
        } else if(p.is_left_child() && node.is_left_child()) {
            this.rotate_right(p);
            this.rotate_right(node);
        } else if(p.is_right_child() && node.is_right_child()) {
            this.rotate_left(p);
            this.rotate_left(node);
        } else if(p.is_left_child() && node.is_right_child()) {
            this.rotate_left(node);
            this.rotate_right(node);
        } else if(p.is_right_child() && node.is_left_child()) {
            this.rotate_right(node);
            this.rotate_left(node);
        }
    };

    SplayTree.prototype.insert = function(v) {
        if(!this.root) {
            this.root = new Node(v);
        } else {
            var curr_node = this.root;
            var p;
            while(curr_node) {
                p = curr_node;
                if(this.comparator(v, curr_node.value) >= 0) {
                    curr_node = curr_node.right;
                } else if(this.comparator(v, curr_node.value) < 0) {
                    curr_node = curr_node.left;
                }
            }
            var the_node = new Node(v, p);
            if(this.comparator(v, p.value) >= 0) {
                p.right = the_node;
            } else {
                p.left = the_node;
            }
            this.splay_to_root(the_node);
        }
        return this;
    };

    SplayTree.prototype.swap_with_predecessor = function(node) {
        var other = node.left;
        while(other.right) {
            other = other.right;
        }
        var temp_value = node.value;
        node.value = other.value;
        other.value = temp_value;
        return other;
    };

    SplayTree.prototype.swap_with_successor = function(node) {
        var other = node.right;
        while(other.left) {
            other = other.left;
        }
        var temp_value = node.value;
        node.value = other.value;
        other.value = temp_value;
        return other;
    };

    SplayTree.prototype.remove = function(v) {
        var node = this.root;
        var other;
        while(node && this.comparator(v, node.value) !== 0) {
            if(this.comparator(v, node.value) > 0) {
                node = node.right;
            } else if(this.comparator(v, node.value) < 0) {
                node = node.left;
            }
        }

        if(node) {
            if(node.is_leaf()) {
                if(node.is_root()) { this.root = undefined; }
                else { node.parent.remove_child(node); }
            } else {
                if(node.left) {
                    other = this.swap_with_predecessor(node);
                } else {
                    other = this.swap_with_successor(node);
                }
                other.remove_child(node);
            }
            this.splay_to_root(node.parent);
        }

        return this;
    };

    SplayTree.prototype.search = function(v) {
        var curr_node = this.root;
        while(curr_node) {
            if(this.comparator(v, curr_node.value) > 0) {
                curr_node = curr_node.right;
            } else if(this.comparator(v, curr_node.value) < 0) {
                curr_node = curr_node.left;
            } else {
                this.splay_to_root(curr_node);
                return curr_node;
            }
        }
        return undefined;
    };

    return SplayTree;

});