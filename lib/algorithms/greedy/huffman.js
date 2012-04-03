define(['underscore-1.3.1', 'tree'], function(underscore, Tree) {

    var _ = this._;

    var Huffman = {};

    Huffman = function(frequencies) { 
        var self = this;
        this.frequencies = frequencies;
        this.tree = new Tree();
        _.each(frequencies, function(freq, letter) {
            self.tree.makeLeaf(freq, letter);
        });
    }

    Huffman.prototype.max_height = function() { return this.frequencies.length; }

    Huffman.prototype.actual_range = function() { 
        return this.tree.height();
    }
    
    Huffman.prototype.roots = function() { return this.tree.roots(); }
    Huffman.prototype.num_roots = function() { return this.roots().length; }    
    Huffman.prototype.nodes = function() { return this.tree.all_nodes(); }
    Huffman.prototype.isLeaf = Tree.isLeaf;
    Huffman.prototype.nodesAtHeight = function(i) { this.tree.nodesAtHeight(i); }

    Huffman.prototype.update = function(nodes)
    {       
        var current_roots = _.sortBy(this.tree.roots(), function(n) { return n.freq; });
        if(current_roots.length === 0) { return false; }
        else if(current_roots.length === 1) {
            this.root = current_roots.shift();
            return true;
        }
        else {
            console.log(current_roots.length);
            var left = current_roots.shift();
            var right = current_roots.shift();
            this.tree.mergeNodes(left, right);
        }
        return true;
    }

    Huffman.prototype.encoding = function(leaf) {
        var encoding = '';
        var node = leaf;
        while(!Tree.isRoot(node))
        {
            if(node.side === 'left') {
                encoding = '0' + encoding;
            } else {
                encoding = '1' + encoding;
            }
            node = node.parent;
        }
        return encoding;
    }

    Huffman.initialize = function(frequencies) {
        var h = new Huffman(frequencies);
        return h;
    }

    return Huffman;
});