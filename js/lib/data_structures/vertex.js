define(['deps/underscore'], function(underscore) {
    
    var _ = underscore._;

    var Vertex = {};

    Vertex = function(x, y) {
        this.x = x;
        this.y = y;
        this.index = Vertex.next_index();
        this.inMST = false;
    };

    Vertex.prototype.toString = function() { return "index: " + this.index + "\ninMST: " + this.inMST; };

    Vertex.clone = function(v) {
        var vertex = new Vertex(v.x, v.y);
        vertex.index = v.index;
        vertex.inMST = v.inMST;
        return vertex;
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
    return Vertex;

});