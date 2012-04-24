define(["lib/utilities", "deps/under"], function(utilities, underscore) { 
    
    var _ = underscore._;

    var genericize = function(str) {
        return str.replace(/\d+/g, "N").replace(/N/g, "A");
    }

    var make_subexp_function = function(str) {
        var chars = str.match(/./g);
        var nums = _.filter(chars, function(c) { return c === 'A'; }).length;
        return { 
            subexp: function(length, start_ix) {
                if(length > nums || length < 1) {
                    throw new Error("Tried to get a subexpression of length " + length + " in an expression of length " + nums); 
                } else {
                    if(length + start_ix > nums) { 
                        throw new Error("There are no subexpressions of this length starting at that index"); 
                    } else {
                        if(length === 1) { return str.charAt(2*start_ix); }
                        else { return str.slice(2*start_ix, 2*start_ix + 2*length - 1); }
                    }
                }
            },
            
            operator: function(ix) { 
                if(ix < 0 || ix >= nums) { 
                    throw new Error("Index out of bounds for expression"); 
                } else {
                    return str.charAt(2*ix + 1);
                }
            }
        }
    }

    var examples = { first: "1-2+3*4*6-7",
                     second: "1-2+3*4*6",
                     third: "1*2-3+4*5-6"
                   }

    var reversed_rules = { "A-A": "B",
                           "A*B": "B",
                           "B+B": "A",
                           "A": "S"
                         }

    var matching_rules = function(rules, front_matches, back_matches, operator) {
        var matches = []
        for(var i = 0; i < front_matches.length; i++) {
            for(var j = 0; j < back_matches.length; j++) {
                var exp = front_matches[i] + operator + back_matches[j]
                var match = rules[exp];
                if(match) { matches.push(match); }
            }
        }
        return _.uniq(matches);
    }

    var validate_expression = function(rules, str) {
        var exp = genericize(str);
        var splitter = make_subexp_function(exp);
        var nums = _.filter(exp.match(/./g), function(c) { return c === 'A'; }).length;
        var table = [];
        for(var subexp_length = 1; subexp_length <= nums; subexp_length++) {
            table[subexp_length] = []
            for(var start_ix = 0; start_ix + subexp_length <= nums; start_ix++) { 
                if(subexp_length === 1) {
                    table[subexp_length][start_ix] = splitter.subexp(subexp_length, start_ix);
                } else {
                    var possibilities = [];
                    for(var front_length = 1; front_length < subexp_length; front_length++) {
                        var front = table[front_length][start_ix];
                        var back = table[subexp_length - front_length][start_ix + front_length];
                        var matches = matching_rules(rules, front, back, splitter.operator(start_ix + front_length - 1));
                        possibilities = possibilities.concat(matches);
                    }
                    table[subexp_length][start_ix] = _.uniq(possibilities);
                }
            }
        }
        return !!rules[table[nums][0]];
    }
    
    return {
        genericize: genericize,
        make_subexp_function: make_subexp_function,
        examples: examples,
        reversed_rules: reversed_rules,
        matching_rules: matching_rules,
        validate_expression: validate_expression 
    }

});