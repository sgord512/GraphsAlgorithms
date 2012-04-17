define(['deps/under', 'lib/data_structures/edge', 'lib/data_structures/vertex'], function(underscore, Edge, Vertex) {

    var _ = underscore._;

    var Graph = {};

    Graph = function() {
        this.edge_list = [];
        this.vertices = [];
        this.Edge = Edge;
        this.Vertex = Vertex;
    }
    
    return Graph;

});
