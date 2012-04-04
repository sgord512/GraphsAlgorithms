define([], function() { 
    
    var next_id = 0;
    
    return {

        generate_table: function(x, y, entry) {
            var t = [];
            for(var i = 0; i < x; i++) {
                t[i] = [];
                for(var j = 0; j < y; j++) {
                    t[i][j] = entry;
                }
            }
            return t;
        },

        id_generator: function() { 
            var id = 0;
            return function() {
                var _id = id;
                id = id + 1;
                return _id;
            };
        },

        generate_unique_id: function() {
            var id = next_id;
            next_id = next_id + 1;
            return id;
        },
        
        random_index: function(l) {
            return Math.floor(Math.random() * l);
        }
        
    }
});