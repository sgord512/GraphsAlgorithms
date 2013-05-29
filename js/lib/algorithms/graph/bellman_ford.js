Vertex = function(index) {
    this.index = index;
};

Edge = function(u, v, weight) {
    this.u = u;
    this.v = v;
    this.weight = weight;
};

Graph = function(vertices, edges) {
    this.vertices = vertices;
    this.edges = edges;
};

/* Graph.prototype.make_table = function(source) {
    var table = [];
    for(var k = 0; k < this.vertices.length; k++) {
        for(var i = 0; i < this.vertices.length; i++) {
            var v = this.vertices[k];
            table[v.index] = [];
            if(k === 0) {
                table[v.index][k] = (source.index === v.index) ? 0 : undefined;
            } else {
                var shorter_path = table[v.index][k - 1];
                var other_possibilities =
            }

        }
    }
} */

Graph.prototype.bellman_ford = function(source) {

};



var vertices = u.map(u.range(0,10), function(i) { return new Vertex(i); });

var edges = [new Edge(0,1,2)
            ,new Edge(0,2,3)
            ,new Edge(0,3,4)
            ,new Edge(1,2,9)
            ,new Edge(1,6,-1)
            ,new Edge(2,3,0)
            ,new Edge(2,4,4)
            ,new Edge(2,5,-2)
            ,new Edge(3,7,8)
            ,new Edge(4,5,6)
            ,new Edge(4,7,1)
            ,new Edge(4,8,3)
            ,new Edge(5,6,1)
            ,new Edge(5,8,4)
            ,new Edge(5,9,9)
            ,new Edge(6,9,4)
            ,new Edge(7,8,2)
            ];

var g = new Graph(vertices, edges);
