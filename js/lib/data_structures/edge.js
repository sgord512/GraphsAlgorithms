define(['deps/under'], function(underscore) {

    var _ = underscore._;

    var Edge = {};

    Edge = function(start, end, g) {
        if(start < end) {
            this.start = start;
            this.end = end;
        }
        else if(start > end) {
            this.start = end;
            this.end = start;
        }
        else if(start == end) {
            this.self_loop = true;
        }

        this.index = Edge.next_index();
        this.inMST = false;
        this.start_point = g.vertices[this.start];
        this.end_point = g.vertices[this.end];
    }

    Edge.prototype.weight = function() { 
        return Math.sqrt(Math.pow(this.start_point.x - this.end_point.x,2) + Math.pow(this.start_point.y - this.end_point.y,2)); 
    };

    Edge.prototype.toString = function() { 
        return "index: " + this.index + "\n" + this.start + " to " + this.end + "\ninMST: " + this.inMST; 
    };

    Edge.clone = function(e, g) {
        var edge = new Edge(e.start, e.end, g);
        edge.index = e.index;
        edge.inMST = e.inMST;
        return edge;
    }

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
    return Edge;
});