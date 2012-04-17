define(["deps/under", "lib/utilities"], function(underscore, utilities) {

    var _ = underscore._;
    
    var CA = {};

    CA = function(config) {
        this.x = config.x || 100;
        this.mode = config.mode || 'bounded';
        this.generation = { generation_number: 0,
                            cells: []
                          }
        this.previous_generations = [];

        var self = this;

        if(_.isNumber(config.rules)) {
            self.rules = {};
            var bin = utilities.pad_front_to_length(utilities.to_binary(config.rules), 8, 0);
            _.each(_.range(0,8), function(num) { 
                var full_string = utilities.pad_front_to_length(utilities.to_binary(num), 3, 0);
                self.rules[full_string] = Number(bin.charAt(num));
            });
        } else if(_.isArray(config.rules)) {
            self.rules = {};
            _.each(_.range(0,8), function(num) {
                var full_string = utilities.pad_front_to_length(utilities.to_binary(num), 3, 0);
                self.rules[full_string] = config.rules[num];
            });
        } else throw new Error("Unknown format for rules!"); 

        this.rules = self.rules;
        
        this.initialize(config.initial_state || 'alone');
    }

    CA.prototype.initialize = function(init) {
        var self = this;
        if(init === 'alone') {
            _.each(_.range(0, this.x), function(loc) {
                self.set(loc, 0);
            });
            self.set(Math.floor(this.x / 2),1);
        } else if(init === 'random') {
            _.each(_.range(0, this.x), function(loc) {
                self.set(loc, ((Math.random() < .5) ? 1 : 0));
            });
        }

    }

    CA.prototype.query = function(x) {
        if(this.mode === 'toroidal') {
            var adjusted_x;
            if(x < 0) { adjusted_x = (x % this.x) + this.x }
            else if(x >= this.x) { adjusted_x = x % this.x; }
            else { adjusted_x = x; }
            return this.generation.cells[adjusted_x];
        } else if(this.mode === 'bounded') {
            return this.generation.cells[x] || 0;
        } else throw new Error("Mode behavior unknown!!!");
    }


    CA.prototype.set = function(x, v) {
        this.generation.cells[x] = v;
    }

    CA.prototype.next_state = function(x) {
        var state = "" + this.query(x - 1) + "" + this.query(x) + "" + this.query(x + 1);
        return this.rules[state];
    }

    CA.prototype.next_generation = function() { 
        var self = this;
        var next_generation = {};
        next_generation.cells = _.map(_.range(0, this.x), function(x) {
            return self.next_state(x);
        });
        next_generation.generation_number = this.generation.generation_number + 1;
        return next_generation;
    }
   
    CA.prototype.update = function() {
        var next_generation = this.next_generation();
        this.previous_generations.push(this.generation);
        this.generation = next_generation;
        return this.total_history();
    }

    CA.prototype.current_state = function() {
        return this.generation;
    }

    CA.prototype.total_history = function() {
        return _.map(this.previous_generations.concat([this.generation]), function(g) { 
            var cells = _.map(g.cells, function(d, i) { return { cell: d, x: i, y: g.generation_number } });
            return { generation_number: g.generation_number, cells: cells };
        });
        
    };
    
    return CA;

});