define(["deps/under", "lib/utilities"], function(underscore, utilities) {

    var _ = underscore._;
    
    var CA = {};

    CA = function(config) {
        this.x = config.x || 100;
        this.min = Math.ceil(0 - this.x / 2);
        this.max = Math.floor(this.x / 2);
        this.mode = config.mode || 'bounded';
        this.generation = { generation_number: 0,
                            positive_values: [],
                            negative_values: []
                          }
        this.previous_generations = [];

        var self = this;

        if(_.isNumber(config.rules)) {
            self.rules = {};
            var bin = utilities.pad_front_to_length(utilities.to_binary(config.rules), 8, 0);
            console.log(bin);
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
            _.each(_.range(this.min, this.max), function(loc) {
                self.set(loc, 0);
            });
            self.set(0,1);
        } else if(init === 'random') {
            _.each(_.range(this.min, this.max), function(loc) {
                self.set(loc, ((Math.random() < .5) ? 1 : 0));
            });
        }

    }

    CA.prototype.query = function(x) {
        var q = query_generation(this.generation);
        return q(x);
    }

    var query_generation = function(generation) {         
        var q = function(x) {
            if(x >= 0) { return generation.positive_values[x] || 0; }
            else if(x < 0) { return generation.negative_values[Math.abs(x)] || 0; }
        }
        q.gen = generation.generation_number;
        return q;
    }

    CA.prototype.set = function(x, v) {
        if(x >= 0) { this.generation.positive_values[x] = v; }
        else if(x < 0) { this.generation.negative_values[Math.abs(x)] = v; }
    }

    CA.prototype.next_state = function(x) {
        var state = "" + this.query(x - 1) + "" + this.query(x) + "" + this.query(x + 1);
        console.log(state);
        return this.rules[state];
    }

    CA.prototype.next_generation = function() { 
        var self = this;
        var next_generation = {};
        next_generation.positive_values = _.map(_.range(0, this.max), function(x) {
            return self.next_state(x);
        });
        next_generation.negative_values = _.map(_.range(this.min, 0), function(x) {
            return self.next_state(x);
        });
        next_generation.generation_number = this.current_generation + 1;
        return next_generation;
    }
   
    CA.prototype.update = function() {
        var next_generation = this.next_generation();
        this.previous_generations.push(this.generation);
        this.generation = next_generation;
        return this.total_history();
    }

    CA.prototype.current_state = function() {
        return this.query;
    }

    CA.prototype.total_history = function() {
        var old_generations = _.map(_.range(0, this.generation.generation_number), function(gen) { 
            return query_generation(this.previous_generations[gen]);
        });
        return old_generations.concat([this.current_state()]);
    };
    
    return CA;

});