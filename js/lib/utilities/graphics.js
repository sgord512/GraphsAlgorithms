define(['deps/under', 'deps/d3'], function(underscore, d3) {

    return {
        create_canvas: function(w, h) {
            return d3.select("#sketchpad")
                .append("svg:svg")
                .attr("height", h)
                .attr("width", w)
                .attr("shape-rendering", 'geometricPrecision');
        }

        





});