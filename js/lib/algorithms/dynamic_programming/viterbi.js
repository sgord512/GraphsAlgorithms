define(['underscore'], function(underscore) {

    var u = underscore;

    var Problem = function(emission_probabilities, transition_probabilities, initial_probabilities, observations) {
        this.transition_probabilities = transition_probabilities;
        this.state_space = u.keys(transition_probabilities);
        this.emission_probabilities = emission_probabilities;
        this.observation_space = u.keys(emission_probabilities[u.first(this.state_space)]);
        this.initial_probabilities = initial_probabilities;
        this.observations = observations;
    }

    // The probability of observing O given state S
    var emission_probabilities = { rainy: { w: .1, s: .4, c: .5 }
                                   , sunny: { w: .6, s: .3, c: .1 } 
                                 }

    // The probability of t + 1 being in state Y given that t was in state X
    var transition_probabilities = { rainy: { rainy: .7, sunny: .3 }
                                     , sunny: { rainy: .4, sunny: .6 }
                                   }

    // The probability of each state at t = 0
    var initial_probabilities = { rainy: .6, sunny: .4 }

    // Observations from which to infer state  
    var observations = ['w','s','c','s','w','w']
    var observations2 = ['w','s','c']

    Problem.prototype.conditional_probability = function(curr_s, prev_s, o) {
        var transition_probability = this.transition_probabilities[prev_s][curr_s];
        var emission_probability = this.emission_probabilities[curr_s][o];
        var conditional_probability = 0;
        var self = this;
        u.each(this.state_space, function(s) {
            conditional_probability = conditional_probability + self.emission_probabilities[s][o] * self.transition_probabilities[s][prev_s];
        });
        
        return (transition_probability * emission_probability) / conditional_probability;
    }

    Problem.prototype.make_prob_table = function() {
        var prob_table = {};

        var obs = this.observation_space;
        for(var i = 0; i < this.state_space.length; i++) {
            var curr_s = this.state_space[i];
            prob_table[curr_s] = {}
            for(var k = 0; k < this.state_space.length; k++) {
                var prev_s = this.state_space[k];
                prob_table[curr_s][prev_s] = {}
                for(var j = 0; j < this.observation_space.length; j++) {
                    var o = this.observation_space[j];
                    var prob = this.conditional_probability(curr_s, prev_s, o);
                    prob_table[curr_s][prev_s][o] = prob;
                }
            }
        }
        this.prob_table = prob_table;
        return prob_table;
    }

    Problem.prototype.make_viterbi_table = function() {
        
        var self = this;
        this.make_prob_table();

        var most_likely_paths_table = [];
        
        for(var t = 0; t < this.observations.length; t++) {
            var o = this.observations[t];
            most_likely_paths_table[t] = {};
            for(var i = 0; i < this.state_space.length; i++) {
                var curr_s = this.state_space[i];
                if(t === 0) { 
                    most_likely_paths_table[t][curr_s] = { state: curr_s, prob: this.initial_probabilities[curr_s], path: [] };
                } else {
                    var prev_paths_and_probs = [];
                    for(var j = 0; j < this.state_space.length; j++) {
                        var prev_s = this.state_space[j];
                        prev_paths_and_probs.push(most_likely_paths_table[t - 1][prev_s]);
                    }

                    var most_likely_path = u.max(prev_paths_and_probs, function(p) { return p.prob * self.prob_table[curr_s][p.state][o]; });
                    most_likely_paths_table[t][curr_s] = { state: curr_s
                                                           , prob: most_likely_path.prob * this.prob_table[curr_s][most_likely_path.state][o]
                                                           , path: most_likely_path.path.concat(most_likely_path.state)
                                                         }
                }

            }
        }
        this.viterbi_table = most_likely_paths_table;
        return most_likely_paths_table;
    }

    Problem.prototype.most_likely_path = function() {
        this.make_viterbi_table();
        var ending_states = this.viterbi_table[this.observations.length - 1];
        var most_likely_end = u.max(ending_states, function(p) { return p.prob; });
        return most_likely_end.path.concat(most_likely_end.state);
    }

    var a = new Problem(emission_probabilities, transition_probabilities, initial_probabilities, observations2);
    
    return Problem;

});