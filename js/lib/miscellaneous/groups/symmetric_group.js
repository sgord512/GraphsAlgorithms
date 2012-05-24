define(['lib/utilities', 'lib/utilities/math', 'deps/under', 'lib/algorithms/sorting/sorts', 'lib/data_structures/set'], function(utilities, math, underscore, Sorts, Set) {

    var _ = underscore._;

    var compare_permutations = function(a, b) {
        var cycle_type_a = a.cycle_type();
        var cycle_type_b = b.cycle_type();
        while(cycle_type_a.length !== 0 && cycle_type_b.length !== 0) { 
            cycle_length_diff = cycle_type_a.pop() - cycle_type_b.pop();
            if(cycle_length_diff) { return cycle_length_diff; }
        }
        var cycles_a = _.reject(a.cycles.slice(), function(c) { return c.length() === 1 });
        var cycles_b = _.reject(b.cycles.slice(), function(c) { return c.length() === 1 });
        while(cycles_a.length !== 0 && cycles_b.length !== 0) {
            cycle_diff = compare_cycles(cycles_a.shift(), cycles_b.shift());
            if(cycle_diff) { return cycle_diff; }
        }
        return 0;
    }

    var compare_cycles = function(a, b) { 
        var a = a.arr.slice();
        var b = b.arr.slice();
        while(a.length !== 0 && b.length !== 0) {
            diff = a.shift() - b.shift(); 
            if(diff) { return diff; }
        }
        return 0;
    }

    var Cycle = function(arr) { 
        var head = _.min(arr);
        while(arr[0] !== head) {
            arr.push(arr.shift());
        }
        this.arr = arr;
    }
    
    Cycle.prototype.length = function() {
        return this.arr.length;
    }

    Cycle.prototype.first = function() { 
        return this.arr[0];
    }

    Cycle.prototype.toString = function() {
        return "(" + this.arr.join(" ") + ")";
    }

    Cycle.prototype.contains = function(n) { 
        return _.include(this.arr, n); 
    }

    Cycle.prototype.index_goes_to = function(n) {
        var i = _.indexOf(this.arr, n);
        var next_i = (i + 1) % this.arr.length;
        return this.arr[next_i];
    }


    var counter = 0;
    var Permutation = function(cycles) {
        var cycle_sets = _.groupBy(cycles, function(c) { return c.length(); });
        this.cycles = _.flatten(_.map(cycle_sets, function(s) { return _.sortBy(s, function(c) { return c.first(); }); }), true);
        this.id = counter; 
        counter = counter + 1;
    }

    Permutation.prototype.cycle_type = function() {
        return _.map(this.cycles, function(c) { return c.length(); });
    }

    Permutation.prototype.toString = function() {
        if(_.last(this.cycle_type()) === 1) { return "()"; }
        return _.map(_.filter(this.cycles, function(c) { return c.length() > 1; }), function(c) { return c.toString(); }).join("");
    }

    Permutation.prototype.toFullString = function() {
        return _.map(this.cycles, function(c) { return c.toString(); }).join("");
    }

    Permutation.prototype.order = function() {
        return _.reduce(this.cycle_type(), function(lcm, e) { return math.least_common_multiple(lcm, e); }, 1);
    }

    Permutation.prototype.index_goes_to = function(n) { 
        var cycle = _.find(this.cycles, function(c) { return c.contains(n); });
        return cycle ? cycle.index_goes_to(n): n;
    }

    Permutation.prototype.act_on_set = function(arr) { 
        var self = this;
        var result_arr = new Array(arr.length);
        _.each(arr, function(n, i) {
            var pos = i + 1;
            result_arr[self.index_goes_to(pos) - 1] = n;
        });
        return result_arr;
    }
              
    var indexOf = function(arr, n) { 
        for(var i = 0; i < arr.length; i++) {
            if(n === arr[i]) { return i; }
        }
        return -1;
    }


    var extract_cycle = function(i, arr) {
        var cycle = [i];
        var current_num = indexOf(arr, i) + 1;
        while(current_num !== cycle[0]) {
            var index = indexOf(arr, current_num) + 1;
            cycle.push(current_num);
            current_num = index;
        }
        return cycle;
    }

    var permutation_from_list = function(arr) { 
        var cycles = [];
        var found_elements = [];
        for(var i = 1; i <= arr.length; i++) {
            if(!_.include(found_elements, i)) {
                var cycle = extract_cycle(i, arr);
                found_elements = _.union(found_elements, cycle);
                cycles.push(new Cycle(cycle));
            }
        }
        return new Permutation(cycles);
    } 

    var generate_all_lists = function(arr) { 
        if(arr.length === 0) { return [[]]; }
        else { 
            return _.flatten(_.map(arr, function(i) { 
                var unused_elements = _.without(arr, i);
                var lists_of_unused_elements = generate_all_lists(unused_elements);
                return _.map(lists_of_unused_elements, function(list) { return list.concat(i); });
            }), true);
        }
    }

    var SymmetricGroup = function(n) {
        this.n = n;
        this.order = math.factorial(n);
        this.name = "S" + n + "";
        this.long_name = "Symmetric Group on " + this.n + " Elements";

        var elements = _.map(generate_all_lists(_.range(1, n + 1)), permutation_from_list);
        var sorter = Sorts(compare_permutations);

        this.elements = sorter.quicksort(elements);
        
    }

    SymmetricGroup.prototype.print_group = function() {
        _.map(this.elements, function(e) { 
            console.log(e.toString());
        });
    }

    SymmetricGroup.prototype.e = function(str) {
        return _.find(this.elements, function(e) { return e.toString() === str; });
    }

    SymmetricGroup.prototype.gets = function(p) {
        return this.e(p.toString());
    }

    SymmetricGroup.prototype.multiply = function(a, b) {
        var set = _.range(1,this.n + 1);
        var permuted_list = a.act_on_set(b.act_on_set(set));
        var permutation = permutation_from_list(permuted_list);
        return this.gets(permutation);
    }

    SymmetricGroup.prototype.group_multiplication_table = function() {
        var self = this;
        return _.map(self.elements, function(a) { 
            return _.map(self.elements, function(b) {
                return self.multiply(a, b);
            });
        });
    }
    
    return SymmetricGroup;
});