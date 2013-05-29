define(['lib/algorithms/graph/random_graph', 'deps/d3', 'lib/algorithms/graph/prim', 'lib/algorithms/graph/kruskal', 'lib/utilities/d3_helper'], function(Graph, d3, prim, kruskal, d3_helper) {

    var d3 = d3;

    return function() {

        var delay = 100;
        var margin = .04;
        var h = 7/8 * d3_helper.dimensions.y();
        var w = 15/16 * d3_helper.dimensions.x();
        var num_vertices = 100;
        var edges_per_vertex = 3;
        var default_color = d3.hsl(180, .10, .0);
        var selected_color = d3.rgb(0, 0, 255);
        var selected_color2 = d3.rgb(255, 0, 0);
        var highlight_color = d3.rgb(255, 255, 0);

        var canvas = d3_helper.create_canvas(w, h);

        var graph_prim = Graph.initialize({ 'edges_per_vertex': edges_per_vertex
                                            , 'num_vertices': num_vertices
                                            , 'x_max': w / 2
                                            , 'y_max': h });

        var graph_kruskal = Graph.clone(graph_prim);

        graph_kruskal.find_mst({ 'algorithm': 'kruskal' });

        graph_prim.find_mst({ 'algorithm': 'prim' });


        var coloring_function = function(c) {
            var color_function = function(d) {
                if (d.inMST) {
                    if (d.last_added) {
                        return highlight_color;
                    } else {
                        return c;
                    }
                } else {
                    return default_color;
                }
            };
            return color_function;
        };

        graph_kruskal.color = coloring_function(selected_color2);
        graph_prim.color = coloring_function(selected_color);

        var width = function(d) {
            if (d.inMST) {
                if (d.last_added) {
                    return 5;
                } else {
                    return 3;
                }
            } else {
                return 1;
            }
        };

        graph_kruskal.scales = {
            x: function(x) { return x; },
            y: function(y) { return y; }
        };
        graph_prim.scales = {
            x: function(x) { return x; },
            y: function(y) { return y; }
        };

        function redraw(graph) {
            graph.g.select("g.graph").selectAll("line")
                .data(graph.edge_list)
                .style("stroke-width", width)
                .style("stroke", graph.color);

            graph.g.select("g.graph").selectAll("circle")
                .data(graph.vertices)
                .attr("r", function(d) { return width(d) + 2; })
                .style("fill", graph.color);
        }

        graph_prim.group = canvas
            .append("svg:g")
            .attr("h", h)
            .attr("w", w / 2)
            .attr("id", graph_prim.algorithm_name)
            .attr("shape-rendering", 'geometricPrecision');

        graph_kruskal.group = canvas
            .append("svg:g")
            .attr("h", h)
            .attr("w", w / 2)
            .attr("id", graph_kruskal.algorithm_name)
            .attr("transform", "translate(" + String(w / 2) + ")")
            .attr("shape-rendering", 'geometricPrecision');


        function draw(graph)
        {

            var group = graph.group;
            var graph_group = group
                .append("svg:g")
                .classed("graph", true)
                .attr("transform",
                      "scale(" + String(1 - (2 * margin)) + ") " +
                      "translate(" + String((w / 2) * margin) + " " + String(h * margin) + ")")

            var dx = graph.scales.x;
            var dy = graph.scales.y;

            graph_group.selectAll("line")
                .data(graph.edge_list)
                .enter()
                .append("svg:line")
                .attr("x1", function(d) { return dx(d.start_point().x); })
                .attr("y1", function(d) { return dy(d.start_point().y); })
                .attr("x2", function(d) { return dx(d.end_point().x); })
                .attr("y2", function(d) { return dy(d.end_point().y); })
                .style("stroke", graph.color);

            graph_group.selectAll("circle")
                .data(graph.vertices)
                .enter()
                .append("svg:circle")
                .attr("cx", function(d) { return dx(d.x); })
                .attr("cy", function(d) { return dy(d.y); })
                .attr("r", function(d) { return width(d) + 2; })
                .style("fill", graph.color);

            group.append("svg:text")
                .style("font-family", "sans-serif")
                .style("fill", graph.color({ inMST: true }))
                .style("alignment-baseline", "text-before-edge")
                .text(graph.algorithm.display_name);

            return group;
        }

        graph_kruskal.g = draw(graph_kruskal);
        graph_prim.g = draw(graph_prim)

        var intervalID = setInterval(function() {
            var kruskal_not_finished = graph_kruskal.find_next_edge();
            var prim_not_finished = graph_prim.find_next_edge();
            redraw(graph_kruskal);
            redraw(graph_prim);
            if (kruskal_not_finished || prim_not_finished) {
                return;
            } else {
                clearInterval(intervalID);
                return;
            }
        }, delay);
    };

});
