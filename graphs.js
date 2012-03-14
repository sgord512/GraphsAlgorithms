define(['underscore-1.3.1', 'edge', 'vertex', 'prim', 'kruskal'], function(underscore, Edge, Vertex, prim, kruskal) {

    var _ = this._;

    var Graph = {};

    Graph = function(config) {
        var c = config || {};
        this.num_vertices = c.num_vertices || 20;
        this.edges_per_vertex = c.edges_per_vertex || (this.num_vertices * 2) ;
        this.h = c.y_max || 500;
        this.w = c.x_max || 500;

        this.edges_in_tree = [];
        this.vertices_in_tree = [];
        this.Edge = Edge;
        this.Vertex = Vertex;
    }

    Graph.prototype.algorithms = { 'prim': prim, 'kruskal': kruskal };

    Graph.prototype.random_coords = function(prev) {
        return { 'x': (Math.random() * this.w), 'y': (Math.random() * this.h) };
    }

    Graph.prototype.descending_coords = function(prev) { 
        var x = prev.x + (this.w / this.num_vertices) * Math.random();
        var y = prev.y + (this.h / this.num_vertices) * Math.random();
        return { 'x': x, 'y': y };
    }

    Graph.prototype.edge_id = function(e) { 
        return e.start * this.num_vertices + e.end; 
    }

    Graph.prototype.addToMST = function(o) {
        if(o instanceof Edge) {
            this.edges_in_tree.unshift(o);
            o.inMST = true;
        }
        else if(o instanceof Vertex) {
            this.vertices_in_tree.unshift(o);
            o.inMST = true;
        }
        else console.log("Tried to add something that wasn't an edge or vertex!");
    }
        
    Graph.prototype.generateVertices = function(generator) { 
        var self = this;
        var vertices = [];
        var gen = _.bind(generator, self);
        var result = { 'x': 0, 'y': 0 };
        _(this.num_vertices).times(function() {
            result = gen(result);
            vertices.push(new Vertex(result.x, result.y));
        });
        return vertices;
    }

    Graph.prototype.generateEdges = function() {
        var self = this;
        var edge_list = [];
        _.each(this.vertices, function(pt) { 
            _(self.edges_per_vertex).times(function() {
                edge_list.push(new Edge(pt.index, Math.floor(Math.random() * self.num_vertices), self));
            });
        });
        
        edge_list = _.reject(edge_list, function(e) { return e.self_loop });
        edge_list = _.sortBy(edge_list, function(e) { return self.edge_id(e) });
        edge_list = _.uniq(edge_list, true, function(e) { return self.edge_id(e) });
        edge_list = _.sortBy(edge_list, function(e) { return e.index });
        return edge_list;
    }

    Graph.prototype.find_mst = function(settings) {
        var algorithm_name = settings.algorithm || 'prim';
        var algorithm = this.algorithms[algorithm_name].initialize(this);
        this.algorithm = algorithm;

        this.find_next_edge = algorithm.find_next_edge;
    }
    
    Graph.initialize = function(config) {
        var g = new Graph(config);

        g.vertices = g.generateVertices(g.random_coords);
        g.edge_list = g.generateEdges();

        g.sorted_edge_list = _.sortBy(g.edge_list, function(e) { return e.weight(); });
   
        return g;

    }

    Graph.clone = function(graph) {
        var g = new Graph({ 'num_vertices': graph.num_vertices
                            , 'edges_per_vertex': graph.edges_per_vertex
                            , 'x_max': graph.x_max
                            , 'y_max': graph.y_max });
        g.vertices = [];
        _.each(graph.vertices, function(v) { g.vertices.push(Vertex.clone(v, g)); });
        g.edge_list = [];
        _.each(graph.edge_list, function(e) { g.edge_list.push(Edge.clone(e, g)); });
        g.sorted_edge_list = _.sortBy(g.edge_list, function(e) { return e.weight(); });
        return g;
    }
    return Graph;

});
