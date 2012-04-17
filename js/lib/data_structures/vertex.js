define(["lib/utilities", "deps/under"], function(utilities, underscore) {
    
    var _ = underscore._;

    var generator = utilities.id_generator();

    var Vertex = {};

    Vertex = function() {
        this.id = generator();
    };

    Vertex.prototype.toString = function() { return "id: " + this.id; };

    return Vertex;

});