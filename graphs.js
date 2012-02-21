$(document).ready(function() {

    function Edge(start, end) {
        this.start = start;
        this.end = end;
        this.inMST = false;
    }

    Edge.prototype.start_point = function() { return points[this.start] };
    Edge.prototype.end_point = function() { return points[this.end] };
    Edge.prototype.weight = function() { return Math.sqrt(Math.pow(this.start_point.x - this.end_point.x,2) + Math.pow(this.start_point.y - this.end_point.y,2)); }

    function Vertex(x, y, index) {
        this.x = x;
        this.y = y;
        this.index = index;
        this.inMST = false;
    }

    Vertex.next_index = function() { 
        if(_.isUndefined(Vertex._next_index)) {
            Vertex._next_index = 1;
            return 0;
        } else {
            var index = Vertex._next_index;
            Vertex._next_index += 1;
            return index;
        }
    };
     

    var h = 7/8 * screen.height;
    var w = screen.width;
    var num_points = 20;
    var num_edges = num_points * 2;
    var color = d3.rgb(0, 0, 0);
    var selected_color = d3.rgb(0, 255, 0);

    var canvas = d3.select("#sketchpad")
        .append("svg:svg")
        .attr("height", h)
        .attr("width", w);

    var points = [];
    _(num_points).times(function() {
        points.push(new Vertex(Math.random() * w, Math.random() * h, Vertex.next_index()));
    });


    var edge_list = []
    _(num_edges).times(function() { 
        edge_list.push(new Edge(Math.floor(Math.random() * num_points), Math.floor(Math.random() * num_points) ) )
    });

    var sorted_edge_list = _.sortBy(edge_list, function(e) { return e.distance });

    var vertices_in_tree = [points[Math.floor(Math.random() * num_points)]];
    _.first(vertices_in_tree)["inMST"] = true;

    function redraw() {
        canvas.selectAll("line")
            .data(edge_list)
            .filter(function(d) { return d.inMST; })
//            .transition()
            .style("stroke-width", 2)
            .style("stroke", selected_color);

        canvas.selectAll("circle")
            .data(points)
            .filter(function(d) { return d.inMST; })
//            .transition()
            .style("fill", selected_color);
    }
    
    function valid_edge(e) {
        var contains_start = _.include(vertices_in_tree, e.start_point());
        var contains_end = _.include(vertices_in_tree, e.end_point());
        console.log("Start: " + e.start + " End: " + e.end);
        console.log("Contains start: " + contains_start + ", contains end: " + contains_end);
        return (contains_start && !contains_end) || (!contains_start && contains_end);
        
    }

    function find_next_edge() {
        if(vertices_in_tree.length == num_points) return;
        var next_edge = sorted_edge_list.shift();
        next_edge.isFirst = true;
        if(_.isUndefined(next_edge)) { console.log("next_edge is undefined"); return; }
        while(!valid_edge(next_edge))
        {
            sorted_edge_list.push(next_edge);
            next_edge = sorted_edge_list.shift();            
            if(next_edge.isFirst) return;
        }
        
        if(_.include(vertices_in_tree, next_edge.start_point())) {
            vertices_in_tree.unshift(next_edge.end_point());
        } else {
            vertices_in_tree.unshift(next_edge.start_point());
        }
        next_edge["inMST"] = true;
        _.first(vertices_in_tree)["inMST"] = true;
    }
     
    canvas.selectAll("circle")
        .data(points)
        .enter()
        .append("svg:circle")
        .attr("cx", function(d) { return d.x })
        .attr("cy", function(d) { return d.y })
        .attr("r", 4)
        .style("fill", function(d) { return color });

    canvas.selectAll("line")
        .data(edge_list)
        .enter()
        .append("svg:line")
        .attr("x1", function(d) { return d.start_point().x })
        .attr("y1", function(d) { return d.start_point().y })
        .attr("x2", function(d) { return d.end_point().x })
        .attr("y2", function(d) { return d.end_point().y })
        .style("stroke", function(d) { return color });

    setInterval(function() {
        find_next_edge();
        console.log(vertices_in_tree.length);
        redraw(); }, 100);

});



    // var adjacency_matrix = [];
    // _(num_points).times(function() {
    //     row = new Array();
    //     _(num_points).times(function() { row.push(Math.random() < .5) });
    //     adjacency_matrix.push(row);
    // });
    // var edge_list = []
    // _.each(adjacency_matrix, function(row, index) { 
    //     _.each(row, function(value, index2) {
    //         if (value) edge_list.push({"start": index, "end": index2});
    //     });
    // });    
    // edge_list = _.map(edge_list, function(e) { 
    //     if(e.start < e.end) {
    //         return e;
    //     } else {
    //         return {"start": e.end, "end": e.start};
    //     }
    // });
    // var comparison_function = function(e) { return e.start * num_points + e.end };
    // edge_list = _.sortBy(edge_list, comparison_function);
    // edge_list = _.uniq(edge_list, true, comparison_function);

    // var color = function(d) { if (d.inMST) { return "black" } else { return "green" } };
