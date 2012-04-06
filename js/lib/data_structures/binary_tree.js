define(['lib/utilities', 'deps/underscore'], function(utilities, underscore) {
    
    var _ = underscore._;

    var generator = utilities.id_generator();

    var Leaf = {}

    Leaf = function() { 
        this.id = generator();
    }

    var BinaryTree = {}

    BinaryTree = function() {
        this.id = generator();
        if(arguments.length === 2) {
            this.left = arguments[0];
            if(!_.isUndefined(this.left)) { this.left.parent = this; }
            this.right = arguments[1];
            if(!_.isUndefined(this.right)) { this.right.parent = this; }
        }
        else if(arguments.length === 0) {
            this.left = new Leaf();
            this.left.parent = this;
            this.right = new Leaf();
            this.left.parent = this;
        }
        else throw new Error("Either 0 or 2 arguments allowed for this function");
    }

    var height = function() {
        if(this instanceof Leaf) { return 0; }
        else { return 1 + Math.max(this.left.height(), this.right.height()); }
    }

    var nodes_in_order = function(node) {
        if(node === undefined) { return []; }
        else if(node instanceof Leaf) { return [node]; }
        else if(node instanceof BinaryTree) {
            var left = nodes_in_order(node.left);
            var middle = [node];
            var right = nodes_in_order(node.right);
            return left.concat(middle).concat(right);
        }
    }

    Leaf.prototype.height = height;
    BinaryTree.prototype.height = height;    

    return { Leaf: Leaf, BinaryTree: BinaryTree, nodes_in_order: nodes_in_order };

});