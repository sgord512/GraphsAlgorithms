$(document).ready(function() {

    function Edge(start, end) {
        if(start < end) {
            this.start = start;
            this.end = end;
        }
        else if(start > end) {
            this.start = end;
            this.end = start;
        }
        else if(start == end) {
            console.log("Self-loop created!");
            this.self_loop = true;
        }

        this.index = Edge.next_index();
        this.inMST = false;
    }

    Edge.prototype.start_point = function() { return points[this.start] };
    Edge.prototype.end_point = function() { return points[this.end] };
    Edge.prototype.weight = function() { return Math.sqrt(Math.pow(this.start_point.x - this.end_point.x,2) + Math.pow(this.start_point.y - this.end_point.y,2)); };
    Edge.prototype.addToMST = function() { console.log(this + " added to MST!"); this.inMST = true; };
    Edge.prototype.id = function() { return this.start * num_points + this.end; };
    Edge.prototype.toString = function() { return "index: " + this.index + ", " + this.start + " to " + this.end; };

    Edge.next_index = function() { 
        if(_.isUndefined(Edge._next_index)) {
            Edge._next_index = 1;
            return 0;
        } else {
            var index = Edge._next_index;
            Edge._next_index += 1;
            return index;
        }
    };

    function Vertex(x, y) {
        this.x = x;
        this.y = y;
        this.index = Vertex.next_index();
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
    var w = screen.width / 2;
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
        points.push(new Vertex(Math.random() * w, Math.random() * h));
    });

    var edge_list = []
    _(num_edges).times(function() { 
        edge_list.push(new Edge(Math.floor(Math.random() * num_points), Math.floor(Math.random() * num_points)))
    });

    var sorted_edge_list = _.reject(edge_list, function(e) { return e.self_loop });
    sorted_edge_list = _.sortBy(sorted_edge_list, function(e) { return e.id() });
    sorted_edge_list = _.uniq(sorted_edge_list, true, function(e) { return e.id() });
    sorted_edge_list = _.sortBy(sorted_edge_list, function(e) { return e.weight() });

    var edges_in_tree = []

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
        //console.log("Start: " + e.start + " End: " + e.end);
        //console.log("Contains start: " + contains_start + ", contains end: " + contains_end);
        return (contains_start && !contains_end) || (!contains_start && contains_end);
        
    }

    function find_next_edge() {
        var next_edge, added_point;
        var current_index = 0;
        if(vertices_in_tree.length == num_points) return;
        while(current_index < sorted_edge_list.length)
        {
            next_edge = sorted_edge_list[current_index];
            if (valid_edge(next_edge)) {
                next_edge.addToMST();
                edges_in_tree.unshift(next_edge);
                break;
            }
            else { 
                current_index += 1;
            }
        }

        if(current_index == sorted_edge_list.length) { 
            console.log("out of luck"); return;
        } else {
            sorted_edge_list = sorted_edge_list.slice(0, current_index).concat(sorted_edge_list.slice(current_index + 1));
        }
                
        if(_.include(vertices_in_tree, next_edge.start_point())) {
            added_point = next_edge.end_point();
        } else {
            added_point = next_edge.start_point();
        }
        vertices_in_tree.unshift(added_point);
        added_point["inMST"] = true;
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
        .data(sorted_edge_list)
        .enter()
        .append("svg:line")
        .attr("x1", function(d) { return d.start_point().x; })
        .attr("y1", function(d) { return d.start_point().y; })
        .attr("x2", function(d) { return d.end_point().x; })
        .attr("y2", function(d) { return d.end_point().y; })
        .attr("id", function(d) { return d.toString();  })
        .style("stroke", function(d) { return color });

    setInterval(function() {
        find_next_edge();
        console.log(vertices_in_tree.length);
        redraw(); }, 100);

});

