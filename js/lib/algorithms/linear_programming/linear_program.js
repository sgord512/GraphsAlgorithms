define(['deps/under', "lib/utilities"], function(underscore, utilities) {

    var _ = underscore._;

    var LinearProgram = {}

    LinearProgram = function(form, program) {
        this.form = form;
        if(form === 'slack') {
            this.N = program.N;
            this.B = program.B;
            this.A = program.A;
            this.b = program.b;
            this.c = program.c;
            this.v = program.v;
        }
    }

    LinearProgram.prototype.basic_solution = function() {
        var assignments = [];
        for(var n = 0; n < this.N.length; n++) {
            assignments[this.N[n]] = 0;
        }
        for(var v = 0; v < this.B.length; v++) {
            assignments[this.B[v]] = this.b[this.B[v]];
        }
        return assignments;
    }
    
    LinearProgram.prototype.objective_value = function(solution) {
        var sum = 0;
        for(var i = 0; i < solution.length; i++) {
            var c = this.c[i];
            if(c) { sum = sum + c * solution[i]; }
        }
        return sum;
    }

    LinearProgram.prototype.pivot = function() {
        var self = this;
        var basic_solution = this.basic_solution();
        var possible_entering_variables = _.filter(this.N, function(n) { return self.c[n] && self.c[n] > 0; });
        var entering_variable = utilities.random_element(possible_entering_variables);
        var bounds = [];
        var assigned_vars = _.without(self.N, entering_variable);           
        _.each(this.b, function(b, i) { 
            if(b) {
                var sum = b;
                for(var j = 0; j < assigned_vars.length; j++) {
                    var v = assigned_vars[j];
                    sum = sum - basic_solution[v] * self.A[i][v];
                }
                bounds.push(sum / self.A[i][entering_variable]);
            } else { bounds.push(undefined); }
        });
        
        var entering_var_value = _.min(_.compact(bounds));
        var leaving_var = _.indexOf(bounds, entering_var_value);

    }

    var example = new LinearProgram('slack', { 'N': [0,1,2],
                                               'B': [3,4,5],
                                               'A': [undefined,
                                                     undefined,
                                                     undefined,
                                                     [1,1,-3],
                                                     [2,2,5],
                                                     [4,1,2]],
                                               'b': [undefined,
                                                     undefined,
                                                     undefined,
                                                     30,
                                                     24,
                                                     36],
                                               'c': [3,1,2],
                                               'v': 0 });

    return { example: example, 
             LinearProgram: LinearProgram
           };

});