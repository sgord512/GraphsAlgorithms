define(['deps/under', 'deps/d3'], function(underscore, d3) {

    var _ = underscore._;

    return {
        create_canvas: function(w, h) {
            canvas = d3.select("#sketchpad")
                       .append("svg:svg")
                       .attr("shape-rendering", 'geometricPrecision');
            if(h) {
               canvas.attr("height", h);
            }

            if(w) {
               canvas.attr("width", w);
            }

            return canvas;

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