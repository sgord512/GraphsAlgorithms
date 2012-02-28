define(['jquery-1.7.1', 'graphs'], function($, Graph) {

    var $ = this.$;

    $(document).ready(function() {

        var h = 7/8 * screen.height;
        var w = screen.width;
        var num_points = 20;
        var num_edges = num_points * 2;
        var default_color = d3.rgb(0, 0, 0);
        var selected_color = d3.rgb(0, 255, 0);

        var canvas = d3.select("#sketchpad")
            .append("svg:svg")
            .attr("height", h)
            .attr("width", w);

        var graph = Graph.initialize({ 'num_edges': num_edges
                                       , 'num_vertices': num_points
                                       , 'x_max': w
                                       , 'y_max': h });

        graph.pickStartVertex();
        
        var color = function(d) { if (d.inMST) { return selected_color; } else { return default_color; } };
        var width = function(d) { if (d.inMST) { return 2; } else { return 1; } };

        function redraw() {
            canvas.selectAll("circle")
                .data(graph.points)
                .style("fill", color)

            canvas.selectAll("line")
                .data(graph.edge_list)
                .style("stroke-width", width)
                .style("stroke", color);
        }

        canvas.selectAll("circle")
            .data(graph.points)
            .enter()
            .append("svg:circle")
            .attr("cx", function(d) { return d.x })
            .attr("cy", function(d) { return d.y })
            .attr("r", 4)
            .style("fill", color);

        canvas.selectAll("line")
            .data(graph.edge_list)
            .enter()
            .append("svg:line")
            .attr("x1", function(d) { return d.start_point().x; })
            .attr("y1", function(d) { return d.start_point().y; })
            .attr("x2", function(d) { return d.end_point().x; })
            .attr("y2", function(d) { return d.end_point().y; })
            .style("stroke", color);

        setInterval(function() {
            if(graph.find_next_edge()) redraw();
        }, 1000);

    });

});