var Vector = {}

Vector = function(/* ... */) {
    if(arguments.length === 1) {
        if(arguments[0] instanceof Array) {
            this.values = values;
            this.d = this.values.length;
        } else if (arguments[0] instanceof Number) {
            this.values = new Array(arguments[0]);
            this.d = this.values.length;
        }
    } else throw new Error("incorrect number of arguments");
}

Vector.create = function(dimensions, values) {
    var v = new Vector(dimensions);
    return v;
}
    