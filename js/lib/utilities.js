define([], function() { 
    
    var next_id = 0;

    return {

        generate_table: function(y, x, entry) {
            var t = [];
            for(var j = 0; j < y; j++) {
                t[j] = [];
                for(var i = 0; i < x; i++) {
                    t[j][i] = entry;
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

        random_index: function(l) {
            return Math.floor(Math.random() * l);
        },

        random_element: function(arr) { 
            return arr[Math.floor(Math.random() * arr.length)];
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
            var map = { 1: 'st', 2: 'nd', 3: 'rd' }
            if(number === 1) { 
                return 'the';
            }
            else {
                var suffix = map[number % 10] || 'th';
                return "" + number + suffix;
            }
        },

        to_binary: function(number) { 
            var num = number;
            var binary_string = '';
            var div = Math.floor(num / 2);
            var rem = num % 2;
            while(num > 0) {
                div = Math.floor(num / 2);
                rem = num % 2;
                binary_string = String(rem) + binary_string;
                num = div;
            }
            return binary_string;
        },

        pad_front_to_length: function(s, length, c) {
            var num = length - s.length;
            var padding = "";
            for(var i = 0; i < num; i++) {
                padding = padding + c;
            }
            return padding + s;
        },

        memoize: function(fn) {
            var table = []
            return function(input) {
                if(table[input]) {
                    return table[input];
                } else {
                    var value = fn(input);
                    table[input] = value;
                    return value; 
                }
            }
        },

        object_to_array: function(obj) {
            var arr = [];
            for(var prop in obj) {
                arr.push({ name: prop, value: obj[prop] });
            }
            return arr;
        },

        translation: function(x, y) {
            return "translate(" + x + "," + y + ") ";
        }


    }
});