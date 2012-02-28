define(['underscore-1.3.1'], function(underscore) {

    var _ = this._;

    var Graph = {}
    Graph.initialize = function(config) {
        var g = {}
        var c = config || {}
        g.num_points = c.num_points || 20;
        g.num_edges = c.num_edges || (g.num_points * 2) ;
        g.h = c.y_max || 500;
        g.w = c.x_max || 500;

        g.Edge = function(start, end) {
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

            this.index = g.Edge.next_index();
            this.inMST = false;
        }

        g.Edge.prototype.start_point = function() { return g.points[this.start] };
        g.Edge.prototype.end_point = function() { return g.points[this.end] };
        g.Edge.prototype.weight = function() { return Math.sqrt(Math.pow(this.start_point().x - this.end_point().x,2) + Math.pow(this.start_point().y - this.end_point().y,2)); };
        g.Edge.prototype.addToMST = function() { this.inMST = true; g.edges_in_tree.unshift(this); console.log(this + " added to MST!"); };
        g.Edge.prototype.id = function() { return this.start * g.num_points + this.end; };
        g.Edge.prototype.toString = function() { return "index: " + this.index + "\n" + this.start + " to " + this.end + "\ninMST: " + this.inMST; };

        g.Edge.next_index = function() { 
            if(_.isUndefined(g.Edge._next_index)) {
                g.Edge._next_index = 1;
                return 0;
            } else {
                var index = g.Edge._next_index;
                g.Edge._next_index += 1;
                return index;
            }
        };

        g.Vertex = function(x, y) {
            this.x = x;
            this.y = y;
            this.index = g.Vertex.next_index();
            this.inMST = false;
        }

        g.Vertex.prototype.addToMST = function() { this.inMST = true; g.vertices_in_tree.unshift(this); console.log(this + " added to MST!"); };
        g.Vertex.prototype.toString = function() { return "index: " + this.index + "\ninMST: " + this.inMST; };

        g.Vertex.next_index = function() { 
            if(_.isUndefined(g.Vertex._next_index)) {
                g.Vertex._next_index = 1;
                return 0;
            } else {
                var index = g.Vertex._next_index;
                g.Vertex._next_index += 1;
                return index;
            }
        };

        g.valid_edge = function(e) {
            var contains_start = g.incident_to_start(e);
            var contains_end = g.incident_to_end(e);
            return (contains_start && !contains_end) || (!contains_start && contains_end);
        }

        g.incident_to_start = function(e) {
            return _.include(g.vertices_in_tree, e.start_point());
        }

        g.incident_to_end = function(e) {
            return _.include(g.vertices_in_tree, e.end_point());
        }


        g.find_next_edge = function() {
            var next_edge, added_point;
            var current_index = 0;
            var edge_found = false;
            if(g.vertices_in_tree.length == g.num_points) return false ;
            while(current_index < g.sorted_edge_list.length)
            {
                next_edge = g.sorted_edge_list[current_index];
                if (g.valid_edge(next_edge)) {
                    next_edge.addToMST();
                    g.sorted_edge_list[current_index] = undefined;
                    g.sorted_edge_list = _.compact(g.sorted_edge_list);
                    edge_found = true;
                    break;
                }
                else { 
                    current_index += 1;
                }
            }

            if(!edge_found) { 
                console.log("out of luck"); return false;
            }
            if(g.incident_to_start(next_edge)) {
                added_point = next_edge.end_point();
            } else if(g.incident_to_end(next_edge)) {
                added_point = next_edge.start_point();
            }
            else console.log("This shouldn't happen");

            added_point.addToMST();

            return true;
        }

        g.edges_in_tree = [];
        g.vertices_in_tree = [];

        
        g.points = [];
        _(g.num_points).times(function() {
            g.points.push(new g.Vertex(Math.random() * g.w, Math.random() * g.h));
        });
        
        g.edge_list = []
        _(g.num_edges).times(function() { 
            g.edge_list.push(new g.Edge(Math.floor(Math.random() * g.num_points), Math.floor(Math.random() * g.num_points)))
        });

        g.edge_list = _.reject(g.edge_list, function(e) { return e.self_loop });
        g.edge_list = _.sortBy(g.edge_list, function(e) { return e.id() });
        g.edge_list = _.uniq(g.edge_list, true, function(e) { return e.id() });
        g.sorted_edge_list = _.sortBy(g.edge_list, function(e) { return e.weight() });

        g.pickStartVertex = function() {
            g.points[Math.floor(Math.random() * g.num_points)].addToMST();
        }
        return g;
    }
    return Graph;
});