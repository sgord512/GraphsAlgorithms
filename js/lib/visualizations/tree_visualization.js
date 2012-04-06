define(['deps/underscore', 'deps/d3/d3', 'lib/algorithms/drawing/tree_algorithms', 'lib/data_structures/binary_tree'], function(underscore, d3, tree_drawing, bt) {

    var _ = underscore._;
    var d3 = d3;

    return function() { 

        var h = 7/8 * screen.height;
        var w = screen.width - 10;
        var grid_size = 20;
        var r = 8;
        
        var grid_x = function(x) { return grid_size * x; }

        var grid_y = function(y) { return grid_size * y; }

        var get_origin_corner = function(d) {
            return { x: grid_x(d.x), y: grid_y(d.y) };
        }

        var get_center_square = function(d) {
            var corner = get_origin_corner(d);
            return { x: corner.x + grid_size / 2, y: corner.y + grid_size / 2 };
        }

        var transform_string = function(x, y) {
            return "translate(" + x + "," + y + ") ";
        }

        var canvas = d3.select("#sketchpad")
            .append("svg:svg")
            .attr("height", h)
            .attr("width", w)
            .attr("shape-rendering", 'geometricPrecision');

        

        var draw_tree = (function() {
            
            var algorithms = tree_drawing.algorithms;

            var bounds = { x: 0, y: 0 };
            
            var _draw_tree = function(tree, algorithm) {
                var group = canvas
                    .append("svg:g")
                    .attr("transform", transform_string(bounds.x, 0));

                var nodes = tree_drawing.nodes_in_order(tree);
                var layout_tree = algorithms[algorithm]();
                var table = layout_tree(tree);
                var lookup = function(d) { return get_center_square(table[d.id]); };
                var node_coords = _.map(nodes, lookup);
                var xs = _.pluck(node_coords, 'x');
                var ys = _.pluck(node_coords, 'y');
                tree_bounds = { x: _.max(xs) + grid_size / 2, y: _.max(ys) + grid_size / 2 };
                bounds = { x: tree_bounds.x + bounds.x, y: tree_bounds.y + bounds.y };
                
                var parents = _.filter(nodes, function(d) { return d instanceof bt.BinaryTree; });
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
                    .style("fill", d3.hsl(0,0,0));
                
                group.selectAll("line")
                    .data(edge_coords)
                    .enter()
                    .append("svg:line")
                    .attr("x1", function(d) { return d.start.x; })
                    .attr("y1", function(d) { return d.start.y; })                
                    .attr("x2", function(d) { return d.end.x; })
                    .attr("y2", function(d) { return d.end.y; })
                    .style("stroke-width", 2)
                    .style("stroke", d3.hsl(0,0,0));
            }
            return _draw_tree;
        }());

        draw_tree(tree_drawing.example_tree, 'knuth_layered_wide');
        draw_tree(tree_drawing.example_tree, 'minimum_width');
        draw_tree(tree_drawing.example_tree, 'third_algorithm');
        draw_tree(tree_drawing.example_tree2, 'knuth_layered_wide');
        draw_tree(tree_drawing.example_tree2, 'minimum_width');
        draw_tree(tree_drawing.example_tree2, 'third_algorithm');
        draw_tree(tree_drawing.example_tree3, 'knuth_layered_wide');
        draw_tree(tree_drawing.example_tree3, 'minimum_width');
        draw_tree(tree_drawing.example_tree3, 'third_algorithm');
        draw_tree(tree_drawing.example_tree4, 'knuth_layered_wide');
        draw_tree(tree_drawing.example_tree4, 'minimum_width');
        draw_tree(tree_drawing.example_tree4, 'third_algorithm');

    };

});