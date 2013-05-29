define(["deps/under", "lib/utilities", "lib/data_structures/graph"], function(underscore, utilities, Graph) {

    var _ = underscore._;

    Graph.create = function(v, e, source, sink) {
        var vertices = _.map(v, function(vx) {
            return new Vertex(vx[0], vx[1]);
        });

        var edges = _.map(e, function(ix) {
            return new Edge(ix[0], ix[1], ix[2]);
        });
        var g = new Graph(vertices, edges, source, sink);
        return g;
    };

    var residual_capacity = function(edges) {
        return _.min(_.pluck(edges, 'capacity'));
    };

    Graph.prototype.residual_edges = function(u,v) {
        var edge = this.get_edge(u,v);
        var residual_edges = [];
        if(edge) {
            if(edge.capacity - edge.flow > 0) { residual_edges.push(new Edge(u, v, edge.capacity - edge.flow)); }
            if(edge.flow > 0) { residual_edges.push(new Edge(v, u, edge.flow)); }
        }
        return residual_edges;
    };

    Graph.prototype.residual_graph = function() {
        var self = this;
        var vertices = _.map(this.vertices, function(v) {
            return new Vertex(v.index, v.name);
        });
        var edges = [];
        _.each(this.edges, function(e) {
            var residue_edges = self.residual_edges(e.u, e.v);
            edges = edges.concat(residue_edges);
        });
        return new Graph(vertices, edges, this.source, this.sink);
    };

    Graph.prototype.augment_flow = function(path) {
        var self = this;
        _.each(path.edges, function(path_edge) {
            var edge = self.get_edge(path_edge.u, path_edge.v);
            if(edge) {
                edge.flow = edge.flow + path.residual_capacity;
            } else {
                edge = self.get_edge(path_edge.v, path_edge.u);
                edge.flow = edge.flow - path.residual_capacity;
            }
        });
    };

    Graph.prototype.get_path_from_vertex = function(v) {
        var edges = [];
        var curr = v;
        while(curr.prev) {
            edges.unshift(this.get_edge(curr.prev.index, curr.index));
            curr = curr.prev;
        }
        return { residual_capacity: residual_capacity(edges), edges: edges };
    };

    Graph.prototype.find_augmenting_path = function() {
        var current_vertex;
        var source = this.get_vertex(this.source);
        source.path_length = 0;
        source.prev = undefined;
        var visited_vertices = [];
        var vertices_to_visit = [source];
        while(current_vertex = vertices_to_visit.shift()) {
            if(current_vertex.index === this.sink) {
                return this.get_path_from_vertex(current_vertex);
            }
            var next_vertices = this.adjacent_vertices(current_vertex);
            next_vertices = _.filter(next_vertices, function(v) { return v.path_length === undefined; });
            _.each(next_vertices, function(v) {
                v.path_length = current_vertex.path_length + 1;
                v.prev = current_vertex;
            });
            vertices_to_visit = _.sortBy(vertices_to_visit.concat(next_vertices), function(v) { return v.path_length });
        }
        return undefined;
    };

    Graph.prototype.ford_fulkerson = function() {
        var residual_graph = this.residual_graph();
        var augmenting_path = residual_graph.find_augmenting_path();
        while(augmenting_path) {
            this.augment_flow(augmenting_path);
            residual_graph = this.residual_graph();
            augmenting_path = residual_graph.find_augmenting_path();
        }
        return this;
    };

    Graph.prototype.max_flow = function() {
        var source = this.get_vertex(this.source);
        var out_edges = this.out_edges(source);
        return _.reduce(out_edges, function(sum, e) { return e.flow + sum; }, 0);
    };

    return Graph;

});