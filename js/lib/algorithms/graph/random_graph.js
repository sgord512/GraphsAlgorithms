define(['deps/under', 'lib/data_structures/graph','lib/data_structures/edge', 'lib/data_structures/vertex'], function(underscore, Graph, Edge, Vertex) {

    var _ = underscore._;

    var generate_graph = function(config) {
        var c = config || {};
        var g = new Graph();
        g.num_vertices = c.num_vertices || 20;
        g.edges_per_vertex = c.edges_per_vertex || (this.num_vertices * 2) ;
        g.h = c.y_max || 500;
        g.w = c.x_max || 500;

        g.edges_in_tree = [];
        g.vertices_in_tree = [];
        g.Edge = Edge;
        g.Vertex = Vertex;
        return g;
    };
    
    Graph.prototype.algorithms = {}

    Graph.prototype.random_coords = function(prev) {
        return { 'x': (Math.random() * this.w), 'y': (Math.random() * this.h) };
    };

    Graph.prototype.descending_coords = function(prev) { 
        var x = prev.x + (this.w / this.num_vertices) * Math.random();
        var y = prev.y + (this.h / this.num_vertices) * Math.random();
        return { 'x': x, 'y': y };
    };

    Graph.prototype.edge_id = function(e) { 
        return e.start * this.num_vertices + e.end; 
    };

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
    };
        
    Graph.prototype.generateVertices = function(generator) { 
        var self = this;
        var vertices = [];
        var gen = _.bind(generator, self);
        var result = { 'x': 0, 'y': 0 };
        _(this.num_vertices).times(function() {
            result = gen(result);
            var v = new Vertex();
            v = _.extend(v, result);
            v.inMST = false;
            vertices.push(v);
        });
        return vertices;
    };

    Edge.prototype.weight = function() { 
        if(!this.start_point() || !this.end_point()) { 
            return undefined; 
        } else {
            return Math.sqrt(Math.pow(this.start_point().x - this.end_point().x,2) + Math.pow(this.start_point().y - this.end_point().y,2)); 
        }
    };
    
    Edge.prototype.start_point = function() {
        return this.g.vertices[this.start];
    }

    Edge.prototype.end_point = function() {
        return this.g.vertices[this.end];
    }

    Graph.prototype.generateEdges = function() {
        var self = this;
        var edge_list = [];
        _.each(this.vertices, function(pt) { 
            _(self.edges_per_vertex).times(function() {
                var e = new Edge(pt.id, Math.floor(Math.random() * self.num_vertices), self);
                e.g = self;
                e.inMST = false;
                edge_list.push(e);
            });
        });
        
        edge_list = _.reject(edge_list, function(e) { return e.self_loop });
        edge_list = _.sortBy(edge_list, function(e) { return self.edge_id(e) });
        edge_list = _.uniq(edge_list, true, function(e) { return self.edge_id(e) });
        edge_list = _.sortBy(edge_list, function(e) { return e.id });
        return edge_list;
    };


    Graph.prototype.find_mst = function(settings) {
        var algorithm_name = settings.algorithm;
        var algorithm = this.algorithms[algorithm_name].initialize(this);
        this.algorithm = algorithm;
        if(_.isUndefined(this.algorithm)) { return false; }
        this.find_next_edge = algorithm.find_next_edge;
    };
    
    Graph.initialize = function(config) {
        var g = generate_graph(config);

        g.vertices = g.generateVertices(g.random_coords);
        g.edge_list = g.generateEdges();

        g.sorted_edge_list = _.sortBy(g.edge_list, function(e) { return e.weight(); });
   
        return g;

    };

    Vertex.clone = function(v) {
        var vertex = new Vertex();
        vertex = _.extend(vertex, { x: v.x, y: v.y });
        vertex.id = v.id;
        vertex.inMST = v.inMST;
        return vertex;
    };

    Edge.clone = function(e, g) {
        var edge = new Edge(e.start, e.end, g);
        edge.id = e.id;
        edge.inMST = e.inMST;
        return edge;
    };

    Graph.clone = function(graph) {
        var g = generate_graph({ 'num_vertices': graph.num_vertices
                            , 'edges_per_vertex': graph.edges_per_vertex
                            , 'x_max': graph.x_max
                            , 'y_max': graph.y_max });
        g.vertices = [];
        _.each(graph.vertices, function(v) { g.vertices.push(Vertex.clone(v, g)); });
        g.edge_list = [];
        _.each(graph.edge_list, function(e) { g.edge_list.push(Edge.clone(e, g)); });
        g.sorted_edge_list = _.sortBy(g.edge_list, function(e) { return e.weight(); });
        return g;
    };

    return Graph;

});
