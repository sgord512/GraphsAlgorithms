define(['deps/under', 'lib/utilities'], function(underscore, utilities) { 

    var _ = underscore._;

    var productions = [{ term: "A", becomes: "-BF+AFA+FB-" },
                       { term: "B", becomes: "+AF-BFB-FA+" }
                      ]

    var hilbert_string = function(n) { 
        var hs = function(n) { 
            if(n === 1) { 
                return "-BF+AFA+FB-";
            } else { 
                var str = hs(n - 1);
                return rewrite(str);
            }
        }
        return hs(n).replace(regex(productions), "").replace(/\+-|-\+/g, "").replace(/(\+|-)/g, function(c) { return (c === "+") ? "-" : "+"; });
    }

    var regex = function(productions) { 
        return new RegExp(_.reduce(_.pluck(productions, 'term'), function(str, term) { return str + "|" + term; }, "").slice(1), "g");
    }

    var rewrite = function(str) { 
        var replacer = function(c) {
            var matched_rule = _.find(productions, function(rule) { return rule.term === c; });
            return matched_rule ? matched_rule.becomes : c;
        }
        
        return str.replace(regex(productions), replacer);
    }
    
    return {
        string: hilbert_string,
        regex: regex,
        rewrite: rewrite,
        productions: productions
    }

});