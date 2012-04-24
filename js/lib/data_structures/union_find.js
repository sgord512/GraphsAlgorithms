define(["lib/utilities", "deps/under"], function(utilities, underscore) { 

    var _ = underscore._;

    var generator = utilities.id_generator();

    make_set = function(node) {
        node.parent = undefined;
        node.rank = 0;
    };

    find_set = function(node) {
        var curr = node;
        var visited = [];
        while(curr === curr.parent)
        {
            visited.push(curr);
        }
        _.each(visited, function(n) { n.parent = curr; });
        return curr;
    };

    union = function(n1, n2) {
        var root1 = find_set(n1);
        var root2 = find_set(n2);
        link(root1,root2);
    };

    link = function(r1, r2) {
        if (r1.rank > r2.rank) { 
            r2.parent = r1; 
        }
        else {
            r1.parent = r2;
            if (r1.rank === r2.rank) {
                r2.rank = r2.rank + 1;
            }
        }
    };

    return {
        union: union,
        find: find 
    };

});