define(["lib/utilities", "deps/under"], function(utilities, underscore) {

    var _ = underscore._;

    var generator = utilities.id_generator();

    Vertex = function(index, name) {
        this.index = index;
        this.name = name;
    };

    Edge = function(u, v, c) {
        this.u = u;
        this.v = v;
        this.capacity = c;
        this.id = generator();
        this.flow = 0;
    };

    Graph = function(vertices, edges, source, sink) {
        this.source = source;
        this.sink = sink;
        this.vertices = vertices;
        this.edges = edges;
    };

    Graph.prototype.adjacency_matrix = function() {

        if(this.matrix === undefined) {

            var matrix = [];

            for(var i = 0; i < this.vertices.length; i++) {
                matrix[i] = [];
                for(var j = 0; j < this.vertices.length; j++) {
                    matrix[i][j] = 0;
                }

            }

            for(var x = 0; x < this.edges.length; x++) {
                var e = this.edges[x];
                matrix[e.u][e.v] = 1;

            }

            this.matrix = matrix;
            return matrix;
        } else {
            return this.matrix;
        }

    };

    Graph.prototype.get_vertex = function(i) { return _.find(this.vertices, function(v) { return v.index === i; }); };
    Graph.prototype.get_edge = function(u,v) { return _.find(this.edges, function(e) { return e.u === u && e.v === v; }); };

    Graph.prototype.edges_directed_from = function(vertex) {
        return _.filter(this.edges, function(e) { return e.u === vertex.index; });
    };

    Graph.prototype.edges_directed_to = function(vertex) {
        return _.filter(this.edges, function(e) { return e.v === vertex.index; });
    };

    Graph.prototype.out_edges = Graph.prototype.edges_directed_from;
    Graph.prototype.in_edges = Graph.prototype.edges_directed_to;

    Graph.prototype.adjacent_vertices = function(vertex) {
        var connecting_edges = this.edges_directed_from(vertex);
        var self = this;
        return _.map(_.pluck(connecting_edges, 'v'), function(index) { return self.get_vertex(index); });
    };

    Graph.prototype.degree = function(i) { return _.filter(this.edges, function(e) { return (i === e.u) || (i === e.v); }).length; };

    return Graph;

});
