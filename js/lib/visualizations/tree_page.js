define(['deps/under', 'deps/d3',
        'lib/miscellaneous/graphics_2d/grid',
        'lib/algorithms/drawing/tree_algorithms',
        'lib/data_structures/binary_tree',
        'lib/utilities/d3_helper'],
       function(underscore, d3, Grid, tree_drawing, bt, d3_helper) {

    var _ = underscore._;
    var node = bt.node;
    var algorithms = tree_drawing.algorithms;
    var algorithm_to_color_map = { 'knuth_layered_wide': 'red',
                                   'minimum_width': 'green',
                                   'third_algorithm': 'blue',
                                   'tilford_reingold': 'purple'
                                 };

    var examples = {
         t1: node(node(), node())
        ,t2: node(node(), node(node(node(node(), undefined), undefined), undefined))
        ,t3: node(node(node(node(node(), node()), node()), node()), node(node(), node()))
        ,t4: node(node(node(), node(node(), node())), node(undefined, node(undefined, node(node(node(node(), node()), node()), undefined))))
        ,t5: node(node(node(node(node(node(), node(node(), node(node(), node(node(), node())))),node()), node()), node()), node(node(),node(node(),node(node(),node(node(node(node(node(),node()),node()),node()),node())))))
    };

    return function() { 

        var h = screen.height - 10;
        var w = screen.width - 10;
        var grid = new Grid('unbounded', 20);
        var r = 8;
        var separator = 20;

        var canvas = d3_helper.create_canvas(w, h);

        grid.draw_grid_lines(canvas);

        var level_y_coord = 0;

        var draw_side_by_side_tree_layouts = function(tree) {            

            var current_x_coord = 0;

            var draw_tree_with_algorithm = function(algorithm) { 
                var group = canvas
                    .append("svg:g")
                    .attr("transform", d3_helper.transforms.translation(current_x_coord, level_y_coord));

                var nodes = tree_drawing.nodes_in_order(tree);
                var drawing_algorithm = algorithms[algorithm];
                var color = algorithm_to_color_map[algorithm];

                var table = drawing_algorithm(tree);
                var lookup = function(d) { return grid.coord_rect_middle(table[d.id]); };
                var node_coords = _.map(nodes, lookup);
                var xs = _.pluck(node_coords, 'x');
                var tree_width = _.max(xs) + grid.unit / 2;

                current_x_coord = current_x_coord + tree_width + grid.unit;
                
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
            };

            _.each(_.keys(algorithms), draw_tree_with_algorithm);

            level_y_coord = level_y_coord + ((tree.height() + 2) * grid.unit);
        };

        _.each(examples, draw_side_by_side_tree_layouts);

    };

});