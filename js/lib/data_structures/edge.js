define(["lib/utilities","deps/under"], function(utilities, underscore) {
    
    var _ = underscore._;

    var generator = utilities.id_generator();

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

        this.id = generator();
        this.g = g;
    }

    Edge.prototype.toString = function() { 
        return "id: " + this.id + "\n" + this.start + " to " + this.end;
    };

    return Edge;
});