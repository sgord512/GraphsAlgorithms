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
        },

        inherit: function(o) {
            return Object.create(o);
        },

        partition: function(list, value) {
            var left = [];
            var middle = [];
            var right = [];
            for(var i = 0; i < list.length; i++) {
                var elem = list[i];
                if(elem < value) {
                    left.push(elem);
                } else if(elem > value) {
                    right.push(elem);
                } else if(elem === value) {
                    middle.push(elem);
                }
            }
            return [left, middle, right];
        },

        split_into_chunks: function(arr, chunk_size) {
            var num_chunks = Math.ceil(arr.length / chunk_size);
            var chunk_arr = [];
            for(var i = 0; i < num_chunks; i++) {
                var chunk;
                if(i === num_chunks - 1) { 
                    chunk = arr.slice(chunk_size * i); 
                } else {
                    chunk = arr.slice(chunk_size * i, chunk_size * (i + 1));
                }
                chunk_arr.push(chunk);
            }
            return chunk_arr;
        },

        to_ordinal_string: function(number) {
            var th = 'th'
            var map = { 1: 'st', 2: 'nd', 3: 'rd', 4: th, 5: th, 6: th, 7: th, 8: th, 9: th, 0: th };
            if(number === 1) { return 'the'; }
            return "" + number + map[number % 10];
        }
        
    }
});