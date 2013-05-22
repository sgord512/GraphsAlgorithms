define(['lib/algorithms/graph/random_graph', 'deps/d3', 'lib/algorithms/graph/prim', 'lib/algorithms/graph/kruskal', 'lib/utilities/d3_helper'], function(Graph, d3, prim, kruskal, d3_helper) {

    var d3 = d3;

    return function() {

        var separator_factor = .02;
        var scaling_factor = (1 - separator_factor);
        var h = 7/8 * screen.height;
        var w = 15/16 * screen.width;
        var available_w = (1 - separator_factor) * w;
        var num_vertices = 100;
        var edges_per_vertex = 3;
        var default_color = d3.hsl(180, .10, .0);
        var selected_color = d3.rgb(0, 0, 255);
        var selected_color2 = d3.rgb(255, 0, 0);

        var canvas = d3_helper.create_canvas(w, h);

        var margin = .05;

        var w_2 = available_w / 2;
        var x_max = w_2;
        var y_max = h * (1 -  3 * margin);

        var graph_prim = Graph.initialize({ 'edges_per_vertex': edges_per_vertex
                                            , 'num_vertices': num_vertices
                                            , 'x_max': x_max
                                            , 'y_max': y_max });

        var graph_kruskal = Graph.clone(graph_prim);

        graph_kruskal.find_mst({ 'algorithm': 'kruskal' });

        graph_prim.find_mst({ 'algorithm': 'prim' });


        var coloring_function = function(c) {
            var color_function = function(d) {
                if (d.inMST) { return c; }
                else { return default_color; }
            };
            return color_function;
        };

        graph_kruskal.color = coloring_function(selected_color2);
        graph_prim.color = coloring_function(selected_color);

        var width = function(d) { if (d.inMST) { return 2; } else { return 1; } };

        var scale_x = function(factor) {
            return d3.scale.linear()
                .domain([0,x_max])
                .range([margin * w_2, w_2 * factor]);
        };

        var scale_y = function(factor) {
            return d3.scale.linear()
                .domain([0,y_max])
                .range([margin * h, h * (factor - 2 * margin)]);
        };

        graph_kruskal.scales = { x: scale_x(scaling_factor), y: scale_y(1) };
        graph_prim.scales = { x: scale_x(scaling_factor), y: scale_y(1) };

        function redraw(graph) {
            graph.canvas.selectAll("line")
                .data(graph.edge_list)
                .style("stroke-width", width)
                .style("stroke", graph.color);

            graph.canvas.selectAll("circle")
                .data(graph.vertices)
                .style("fill", graph.color);
        }

        function draw(graph)
        {

            var dx = graph.scales.x;
            var dy = graph.scales.y;

            var group = canvas
                .append("svg:svg")
                .attr("height", dy(h))
                .attr("width", dx(w))
                .attr("id", graph.algorithm_name)
                .attr("shape-rendering", 'geometricPrecision');

            group.selectAll("line")
                .data(graph.edge_list)
                .enter()
                .append("svg:line")
                .attr("x1", function(d) { return dx(d.start_point().x); })
                .attr("y1", function(d) { return dy(d.start_point().y); })
                .attr("x2", function(d) { return dx(d.end_point().x); })
                .attr("y2", function(d) { return dy(d.end_point().y); })
                .style("stroke", graph.color);

            group.selectAll("circle")
                .data(graph.vertices)
                .enter()
                .append("svg:circle")
                .attr("cx", function(d) { return dx(d.x); })
                .attr("cy", function(d) { return dy(d.y); })
                .attr("r", 3)
                .style("fill", graph.color);

            group.append("svg:text")
                .style("font-family", "sans-serif")
                .style("fill", graph.color({ inMST: true }))
                .style("alignment-baseline", "text-before-edge")
                .text(graph.algorithm.display_name);

            return group;
        }

        graph_kruskal.canvas = draw(graph_kruskal);
        graph_prim.canvas = draw(graph_prim)
            .attr("x", w_2);

        setInterval(function() {
            if(graph_kruskal.find_next_edge()) redraw(graph_kruskal);
            if(graph_prim.find_next_edge()) redraw(graph_prim);
        }, 100);
    };

});
