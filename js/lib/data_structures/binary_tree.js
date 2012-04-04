define(['lib/utilities', 'deps/underscore'], function(utilities, underscore) {
    
    var _ = underscore._;

    var BinaryTree = {}

    var generator = utilities.id_generator();

    BinaryTree = function() {
        this.id = generator();
        this.left = undefined;
        this.right = undefined;
    }

    BinaryTree.prototype.height = function()

});