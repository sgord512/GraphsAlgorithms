define(["deps/under", "lib/utilities"], function(underscore, utilities) {

    var _ = underscore._;
    
    return function(implementation) {
        
        var DataStore = implementation || require('lib/data_structures/splay_tree');

        var Set = {};
        
        Set = function(comparator, initial_contents) {
            var set = new DataStore(comparator);
            if(initial_contents) {
                _.each(initial_contents, function(e) {
                    set.insert(e);
                });
            }
            this.set = set;
        }   
        
        Set.prototype.search = function(v) {
            return this.set.search(v);
        }

        Set.prototype.insert = function(v) {
            return this.set.insert(v);
        }

        Set.prototype.remove = function(v) {
            return this.set.remove(v);
        }

        return Set;
    }     

});