define(["lib/utilities", "deps/under"], function(utilities, underscore) { 

    var _ = underscore._;

    var counter = 1;

    var nodes = u.map(u.range(1,17), function(n) {
        var node = { 'name': "v" + counter, 'rank': 0 };
        counter = counter + 1;
        node.parent = node;
        return node;
    });

    make_set = function(node) {
        node.parent = node;
        node.rank = 0;
    };

    find_set = function(node) {
        var curr = node;
        var visited = [];
        while(curr.parent != curr)
        {
            visited.push(curr);
            curr = curr.parent;
        }
        u.each(visited, function(n) { n.parent = curr; });
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

});