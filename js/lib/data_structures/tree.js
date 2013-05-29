define(['lib/utilities','deps/under'], function(utilities, underscore) {

    var _ = underscore._;

    var Tree = {};

    var generator = utilities.id_generator();

    Tree = function() {
        this.nodes = [];
        this.leaves = [];
        this.branches = [];
        this.id = generator();
    };

    Tree.isRoot = function(node) {
        return _.isUndefined(node.parent);
    };

    Tree.isLeaf = function(node) {
        return node instanceof Tree.Leaf;
    };

    Tree.prototype.onNodes = function(f) { return _.map(this.nodes, f); };
    Tree.prototype.onLeaves = function(f) { return _.map(this.leaves, f); };

    Tree.prototype.mergeNodes = function(left, right) {
        var n = new Tree.Node(left, right);
        left.parent = n;
        left.update_depths();
        left.side = 'left';
        right.parent = n;
        right.update_depths();
        right.side = 'right';
        this.nodes.unshift(n);
        this.branches.unshift(n);
        return n;
    };

    Tree.prototype.roots = function() {
        var roots = _.filter(this.nodes, Tree.isRoot);
        return _.sortBy(roots, function(n) { return 1 - n.freq; });
    };

    Tree.prototype.all_nodes = function() {
        return _.sortBy(this.nodes, function(n) { return 1 - n.freq; });
    };

    Tree.prototype.nodesAtHeight = function(h) {
        var heights = _.groupBy(nodes, 'height');
        return heights.h;
    };

    Tree.prototype.height = function() { return _.max(_.pluck(this.nodes, 'height')); };

    Tree.prototype.makeLeaf = function(frequency, letter) {
        var l = new Tree.Leaf(frequency, letter);
        this.nodes.unshift(l);
        this.leaves.unshift(l);
        return l;
    };

    Tree.Leaf = function(frequency, letter) {
        this.freq = frequency;
        this.letter = letter;
        this.height = 0;
        this.depth = 0;
        this.id = generator();
    };

    Tree.Leaf.prototype.toString = function() {
        return this.letter + ": " + this.freq + "%";
    };

    Tree.Node = function(left, right) {
        this.freq = left.freq + right.freq;
        this.left = left;
        this.right = right;
        this.height = _.max([right.height, left.height]) + 1;
        this.depth = 0;
        this.id = generator();
    };

    var root = function() {
        if(_.isUndefined(this.parent)) {
            return this;
        } else {
            return this.parent.root();
        }
    };

    Tree.Node.prototype.root = root;
    Tree.Leaf.prototype.root = root;

    var path = function() {
        var node = this;
        var path = [];
        while(!_.isUndefined(node.parent)) {
            path.unshift(node.side);
            node = node.parent;
        }
        return path;
    };

    Tree.Node.prototype.path = path;
    Tree.Leaf.prototype.path = path;

    var layer_offset = function() {
        var path = this.path().reverse();
        var sum = 0;
        var encoding = _.map(path, function(side, i) {
            if (side === 'left') {
                return 0;
            } else if (side === 'right') {
                return 1;
            } else { return false; }
        });
        _.each(encoding, function(val, i) { sum = sum + val * Math.pow(2, i); });
        return sum;
    };

    Tree.Node.prototype.layer_offset = layer_offset;
    Tree.Leaf.prototype.layer_offset = layer_offset;

    var depth = function() {
        this.depth = this.depth + 1;
        if (this instanceof Tree.Node) {
            this.left.update_depths();
            this.right.update_depths();
        }
        return true;
    };

    Tree.Node.prototype.update_depths = depth;
    Tree.Leaf.prototype.update_depths = depth;

    Tree.Node.prototype.toString = function() {
        return "_: " + this.freq + "%";
    };

    return Tree;
});
