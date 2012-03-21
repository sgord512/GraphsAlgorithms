define(['jquery-1.7.1', 'd3/d3', 'underscore-1.3.1'], function($, d3, underscore) {
    
    var _ = this._;
    var $ = this.$;
    var d3 = this.d3;

    var h = screen.height;
    var cx = h / 2;
    var w = screen.width;
    var cy = w / 2;

    var radius = 20;
    var diameter = 2 * radius;
    var n = 6;

    var dy = 3 / 2;
    var dx = Math.sqrt(3) / 2;

    var coords = [];
    _.each(_.range(0, n), function(i) {
        coords.push({ r: radius, theta: ((2 * i + 0)/ n) * Math.PI});
    });

    var all_shapes = []
    
    var shape = { translation: { x: cx, y: cy }, points: coords };
    
    var left_x = cx - Math.ceil(cx / diameter) * diameter;
    var left_y = cy - Math.ceil(cy / diameter) * diameter;
    var offset = false;
    var start_x;
    var shape_width = Math.sqrt(3) * radius;
    for(var curr_y = left_y; curr_y < h + diameter; curr_y = curr_y + dy * radius) {
        if (offset) { start_x = left_x + dx * radius; } else { start_x = left_x; }
        for(var curr_x = start_x; curr_x < w + shape_width; curr_x = curr_x + shape_width) {
            all_shapes.unshift({ translation:  { x: curr_x, y: curr_y }, points: coords });
        }
        offset = !offset;
    }

    $(document).ready(function() {
        var canvas = d3.select("#sketchpad")
            .append("svg:svg")
            .attr("shape-rendering", "geometricPrecision")
            .attr("height", h)
            .attr("width", w);


        var line = d3.svg.line.radial()
            .radius(function(d) { return d.r; })
            .angle(function(d) { return d.theta; });
        
        var transform_string = function(t) {
            return "translate(" + t.x + " " + t.y + ") ";
        }
        
        var tiles = canvas.selectAll("g")
            .data(all_shapes) 
            .enter()
            .append("svg:g")
            .attr("transform", function(d) { return transform_string(d.translation); })
            .append("svg:path")
            .attr("d", function(d) { return line(d.points) + "Z"; })
            .attr("stroke", d3.rgb(255,0,0));

    });


});