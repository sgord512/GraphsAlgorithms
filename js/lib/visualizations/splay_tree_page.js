define(["deps/under", "deps/d3", "lib/utilities", "lib/miscellaneous/grid", "lib/algorithms/drawing/tree_algorithms", "lib/data_structures/splay_tree"], function(underscore, d3, utilities, Grid, tree_drawing, st) {

    var _ = underscore._;

    return function() { 

        var h = screen.height - 10;
        var w = screen.width - 10;
        var grid = Grid('unbounded', 20);
        var r = 8;
        var separator = 20;

        var transform_string = function(x, y) {
            return "translate(" + x + "," + y + ") ";
        }

        var canvas = d3.select("#sketchpad")
            .append("svg:svg")
            .attr("height", h)
            .attr("width", w)
            .attr("shape-rendering", 'geometricPrecision');

        grid.draw_grid_lines(canvas);

        var draw_tree = (function() {
            
            var algorithms = tree_drawing.algorithms;

            var bounds = { x: 0, y: 0 };
            
            var _draw_tree = function(tree, algorithm, bounds) {
                var group = canvas
                    .append("svg:g")
                    .attr("transform", transform_string(bounds.x, bounds.y));

                var nodes = tree_drawing.nodes_in_order(tree);
                var drawing_algorithm = algorithms[algorithm];
                var color = algorithm_to_color_map[algorithm];

                var table = drawing_algorithm(tree);
                var lookup = function(d) { return grid.coord_rect_middle(table[d.id]); };
                var node_coords = _.map(nodes, lookup);
                var xs = _.pluck(node_coords, 'x');
                var ys = _.pluck(node_coords, 'y');
                var tree_bounds = { x: _.max(xs) + grid.unit / 2, y: _.max(ys) + grid.unit / 2 };
                _draw_tree.bounds = tree_bounds;
                
                var parents = _.reject(nodes, function(d) { return d.is_leaf(); });
                var edges = _.flatten(_.map(parents, function(d) { 
                    var e = [];
                    if(!_.isUndefined(d.left)) { e.push({ start: d, end: d.left }); }
                    if(!_.isUndefined(d.right)) { e.push({ start: d, end: d.right }); }
                    return e;
                }));
                var edge_coords = _.map(edges, function(d) { return {start: lookup(d.start), end: lookup(d.end) }; });


                group.selectAll("circle")
                    .data(node_coords)
                    .enter()
                    .append("svg:circle")
                    .attr("cx", function(d) { return d.x; })
                    .attr("cy", function(d) { return d.y; })
                    .attr("r", r)
                    .style("fill", color);
                
                group.selectAll("line")
                    .data(edge_coords)
                    .enter()
                    .append("svg:line")
                    .attr("x1", function(d) { return d.start.x; })
                    .attr("y1", function(d) { return d.start.y; })                
                    .attr("x2", function(d) { return d.end.x; })
                    .attr("y2", function(d) { return d.end.y; })
                    .style("stroke-width", 2)
                    .style("stroke", color);
            }
            return _draw_tree;
        }());

        var bounds = { x: 0, y: 0 };
        _.each(examples, function(tree) {
            draw_tree(tree, 'knuth_layered_wide', { x: 0, y: bounds.y });
            var first_bounds = { x: draw_tree.bounds.x, y: bounds.y };
            draw_tree(tree, 'minimum_width', first_bounds);
            var second_bounds = { x: draw_tree.bounds.x + first_bounds.x, y: bounds.y };
            draw_tree(tree, 'third_algorithm', second_bounds);
            bounds.y = draw_tree.bounds.y + bounds.y + separator;
        });

    };

});