var u = require('underscore');

var Problem = function(len, cuts) {
    this.len = len;
    this.cuts = cuts;
}

Problem.prototype.min_cost = function() {
    this.build_table();
    return this.table[this.cuts.length][0];
}

Problem.prototype.build_table = function() {
    var prev_min, front_cost, back_cost, min_cost, current_cost, span, start_ix, inner_span, costs_of_splits;
    var points = [0].concat(this.cuts.concat([this.len]));
    this.table = [];
    for(span = 0; span < points.length - 1; span++) {
        this.table[span] = [];
        for(start_ix = 0; start_ix + span < points.length - 1; start_ix++) {
            if (span === 0) { 
                min_cost = 0; 
            } else {
                costs_of_splits = []
                for(inner_span = 0; inner_span < span; inner_span++)
                {
                    front_cost = this.table[inner_span][start_ix];
                    back_cost = this.table[span - inner_span - 1][start_ix + inner_span + 1];
                    costs_of_splits.push(front_cost + back_cost);
                }
                prev_min = u.min(costs_of_splits);
                current_cost = points[start_ix + span + 1] - points[start_ix];
                min_cost = prev_min + current_cost;
            }
            this.table[span][start_ix] = min_cost;
        }
    }
}

var a = new Problem(10, [1,4,5,8]);

var b = new Problem(63, [1,2,4,7,9,11,15,18,21,22,25,28,33,39,46,47,48,50,53,54,56,59,61,62]);