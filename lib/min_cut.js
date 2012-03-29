var u = require('underscore');

var c = 10;

Vertex = function(index) { 
    this.index = index;
    this.merged_with = [];
}

Edge = function(u, v) {
    this.u = u;
    this.v = v;
}

Graph = function(vertices, edges) {
    this.vertices = vertices;
    this.edges = edges;
    this.min_cuts = [];
    this.original = {}
    this.original.edges = edges;
    this.original.vertices = vertices;
}

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
            matrix[e.v][e.u] = 1;
        }

        this.matrix = matrix;
        return matrix;
    } else { 
        return this.matrix;
    }

}

Graph.prototype.get_vertex = function(i) { return u.find(this.vertices, function(v) { return v.index === i; }); };

Graph.prototype.degree = function(i) { return u.filter(this.edges, function(e) { return (i === e.u) || (i === e.v); }).length; };

Graph.prototype.contract_edge = function() {
    var edge = this.edges[Math.floor(Math.random() * this.edges.length)];
    this.edges = u.without(this.edges, edge);
    for(var i = 0; i < this.edges.length; i++) {
        var e = this.edges[i];
        if(e.u === edge.u) { 
            e.u = edge.v;
        }
        if(e.v === edge.u) {
            e.v = edge.v;
        }
    }

    this.edges = u.reject(this.edges, function(e) { return (e.v === edge.v) && (e.u === edge.v); });
    var v = this.get_vertex(edge.v);
    var removed = this.get_vertex(edge.u);
    v.merged_with = v.merged_with.concat(removed.merged_with).concat([edge.u]);
    this.vertices = u.without(this.vertices, removed);
}

Graph.prototype.kargers_algorithm = function() { 
    var self = this;
    u((this.vertices.length * (this.vertices.length - 1) * c) / 2).times(function() { self.add_min_cuts(); });
    var min_cuts = u.groupBy(this.min_cuts, 'cost');
    var min_cost = u.min(u.keys(min_cuts));
    return u.first(min_cuts[min_cost]);
}

Graph.prototype.do_iteration = function() {
    this.original.edges = u.map(this.edges, function(e) { return new Edge(e.u,e.v); });
    this.original.vertices = u.map(this.vertices, function(v) { return new Vertex(v.index); });
    while(this.vertices.length > 2) {
        this.contract_edge();
    }
    var self = this;
    var min_cuts = u.map(this.vertices, function(v) {
        var cut = v.merged_with.concat([v.index]);
        return { vertices: cut, cost: self.degree(v.index) };
    });
    this.min_cuts = this.min_cuts.concat(min_cuts);
}

Graph.prototype.add_min_cuts = function() {
    this.do_iteration();
    this.restore();
}

Graph.prototype.reset_min_cuts = function() {
    this.min_cuts = [];
}

Graph.prototype.restore = function() {
    this.edges = this.original.edges;
    this.vertices = this.original.vertices;
}

var vertices = u.map(u.range(0,10), function(i) { return new Vertex(i); });

var edges = [new Edge(0,1)
            ,new Edge(0,2)
            ,new Edge(0,3)
            ,new Edge(1,2)
            ,new Edge(1,6)
            ,new Edge(2,3)
            ,new Edge(2,4)
            ,new Edge(2,5)
            ,new Edge(3,7)
            ,new Edge(4,5)
            ,new Edge(4,7)
            ,new Edge(4,8)
            ,new Edge(5,6)
            ,new Edge(5,8)
            ,new Edge(5,9)
            ,new Edge(6,9)
            ,new Edge(7,8)
            ]

var g = new Graph(vertices, edges);
