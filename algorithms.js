define(['jquery-1.7.1', 'graphs', 'd3/d3'], function($, Graph, d3) {

    var $ = this.$;
    var d3 = this.d3;

    $(document).ready(function() {

        var separator_factor = .02;
        var scaling_factor = (1 - separator_factor) / 2;
        var h = 7/8 * screen.height;
        var w = 15/16 * screen.width;
        var num_vertices = 200;
        var edges_per_vertex = 4;
        var default_color = d3.hsl(180, .10, .0);
        var selected_color = d3.rgb(0, 0, 255);
        var selected_color2 = d3.rgb(255, 0, 0);

        var canvas = d3.select("#sketchpad")
            .append("svg:svg")
            .attr("height", h)
            .attr("width", w);
//            .attr("shape-rendering", 'geometricPrecision');

        var graph_prim = Graph.initialize({ 'edges_per_vertex': edges_per_vertex
                                          , 'num_vertices': num_vertices
                                          , 'x_max': w
                                          , 'y_max': h });

        var graph_kruskal = Graph.clone(graph_prim);

        graph_kruskal.find_mst({ 'algorithm': 'kruskal' });

        graph_prim.find_mst({ 'algorithm': 'prim' });

        
        var coloring_function = function(c) { 
            var color_function = function(d) {
                if (d.inMST) { return c; }
                else { return default_color; } 
            } 
            return color_function;
        };

        graph_kruskal.color = coloring_function(selected_color2); 
        graph_prim.color = coloring_function(selected_color);

        var width = function(d) { if (d.inMST) { return 2; } else { return 1; } };

        var scale_x = function(factor) { 
            return d3.scale.linear()
                .domain([0,w])
                .range([0,w * factor]);
        }

        var scale_y = function(factor) { 
            return d3.scale.linear()
                .domain([0,h])
                .range([0,h * factor]);
        }

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
                .attr("x1", function(d) { return dx(d.start_point.x); })
                .attr("y1", function(d) { return dy(d.start_point.y); })
                .attr("x2", function(d) { return dx(d.end_point.x); })
                .attr("y2", function(d) { return dy(d.end_point.y); })
                .style("stroke", graph.color);

            group.selectAll("circle")
                .data(graph.vertices)
                .enter()
                .append("svg:circle")
                .attr("cx", function(d) { return dx(d.x) })
                .attr("cy", function(d) { return dy(d.y) })
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
        var offset = scale_x(separator_factor + scaling_factor)(w);
        graph_prim.canvas = draw(graph_prim)
            .attr("x", offset);
        
        setInterval(function() {
            if(graph_kruskal.find_next_edge()) redraw(graph_kruskal);
            if(graph_prim.find_next_edge()) redraw(graph_prim);
        }, 100);

    });

});