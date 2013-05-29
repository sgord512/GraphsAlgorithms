define(['deps/under', 'deps/d3'], function(underscore, d3) {

    var _ = underscore._;

    return {
        create_canvas: function(w, h) {
            return d3.select("#sketchpad")
                .append("svg:svg")
                .attr("height", h)
                .attr("width", w)
                .attr("shape-rendering", 'geometricPrecision');
        },

        dimensions: {
            x: function() { return window.innerWidth; },
            y: function() { return window.innerHeight; }
        },

        transforms: {
            translation: function(x, y) {
                return "translate(" + x + "," + y + ") ";
            }
        },

        polygon: function(points) {
            return _.map(points, function(point) {
                return (new String(point.x)).concat(",").concat(new String(point.y));
            }).join(" ");
        }

    };

});