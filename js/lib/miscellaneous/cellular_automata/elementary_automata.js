define(["deps/under", "lib/utilities"], function(underscore, utilities) {

    var _ = underscore._;
    
    var CA = {};

    CA = function(config) {
        this.x = config.x || 100;
        this.mode = config.mode || 'bounded';
        this.generation = 0;
        this.cells = [];
        var initial_state = config.initial_state || 'alone';

        var self = this;

        if(_.isNumber(config.rules)) {
            self.rules = {};
            var bin = utilities.pad_front_to_length(utilities.to_binary(config.rules), 8, 0);
            _.each(_.range(0,8), function(num) { 
                var full_string = utilities.pad_front_to_length(utilities.to_binary(num), 3, 0);
                self.rules[full_string] = Number(bin.charAt(num));
            });
            this.code = config.rules;
        } else throw new Error("Unknown format for rules!"); 

/*
          else if(_.isArray(config.rules)) {
            self.rules = {};
            _.each(_.range(0,8), function(num) {
                var full_string = utilities.pad_front_to_length(utilities.to_binary(num), 3, 0);
                self.rules[full_string] = config.rules[num];
            });

            }
*/ 

        this.rules = self.rules;
        this.initialize(initial_state);
    }

    CA.prototype.initialize = function(init) {
        var self = this;
        if(init === 'alone') {
            _.each(_.range(0, this.x), function(x) {
                self.cells[x] = 0;
            });
            self.cells[Math.floor(this.x / 2)] = 1;
        } else if(init === 'random') {
            _.each(_.range(0, this.x), function(x) {
                self.cells[x] = (Math.random() < .5) ? 1 : 0;
            });
        } else throw new Error("Unknown initial state: " + init); 
    }

    CA.prototype.get_cell = function(x) {
        if(this.mode === 'toroidal') {
            var adjusted_x;
            if(x < 0) { adjusted_x = (x % this.x) + this.x }
            else if(x >= this.x) { adjusted_x = x % this.x; }
            else { adjusted_x = x; }
            return this.cells[adjusted_x];
        } else if(this.mode === 'bounded') {
            return this.cells[x] || 0;
        } else throw new Error("Unknown mode: " + this.mode);
    }

    CA.prototype.step_cell = function(x) {
        var state = "" + this.get_cell(x - 1) + "" + this.get_cell(x) + "" + this.get_cell(x + 1);
        return this.rules[state];
    }

    CA.prototype.next_generation = function() { 
        var self = this;
        return _.map(_.range(0, this.x), function(x) {
            return self.step_cell(x);
        });
    }
   
    CA.prototype.step = function() {
        this.cells = this.next_generation();
        this.generation = this.generation + 1;
        return this.current_generation();
    }

    CA.prototype.current_generation = function() {
        return { generation: this.generation, cells: this.cells };
    }
    
    return CA;

});