define(['lib/miscellaneous/hanoi', 'deps/d3', 'deps/under', 'lib/utilities'], function(Hanoi, d3, underscore, utilities) {


    var _ = underscore._;

    return function() { 
        
        var step_length = 50;
        var h = screen.availHeight - 50;
        var w = screen.availWidth - 50;
        var n = 8;
        var number_of_pegs = 3;
        var rounding_radius = 5;
        var separation_factor = 1/8;
        var padding = separation_factor / 2;
        var block_height = (h / n) * (1 - separation_factor);
        var block_width = (w / number_of_pegs) * (1 - separation_factor);

        var example = [{ name: 'a', value: [{ position: 0, value: 5 },
                                            { position: 1, value: 4 },
                                            { position: 2, value: 3 },
                                           ] },
                       { name: 'mid', value: [] },
                       { name: 'b', value: [{ position: 0, value: 2 },
                                            { position: 1, value: 1 }
                                           ] }
                      ];

        var canvas = d3.select("#sketchpad")
            .append("svg:svg")
            .attr("height", h)
            .attr("width", w)
            .attr("shape-rendering", 'geometricPrecision');

        var y_interpolator = d3.interpolate((h - (h / n)) + padding, padding); 
        var y = function(d) { return y_interpolator(d.position / (n - 1)); }

        var width_interpolator = d3.interpolate(1/2, 1);
        var width = function(d) { return width_interpolator(d.value / n) * block_width; }
        var x = function(d) { return (block_width - width(d)) / 2; }

        var color_interpolator = d3.interpolate(d3.rgb("red"), d3.rgb("blue"));
        var color = function(d) { return color_interpolator(d.value / n); }

        var transform_string = function(x, y) {
            return "translate(" + x + "," + y + ") ";
        }

        var draw = function(pegs) {
            
            var groups = canvas
                .selectAll("g")
                .data(pegs, function(d) { return d.name })
                .enter()
                .append("svg:g")
                .attr("id", function(d) { return d.name })
                .attr("transform", function(d, i) { return transform_string(w * (i / number_of_pegs), 0) });
            
            var disks = groups
                .selectAll("rect")
                .data(function(d) { return d.value; })
                .enter()
                .append("svg:rect");
            
            disks.attr("x", x)
                .attr("y", y)
                .attr("width", width)
                .attr("height", block_height)
                .attr("rx", rounding_radius)
                .attr("ry", rounding_radius)
                .attr("fill", color);
        }

        var redraw = function(pegs) {

            var groups = canvas.selectAll("g")
                .data(pegs, function(d) { return d.name });
            
            groups.exit().remove();

            var disks = groups
                .selectAll("rect")
                .data(function(d) { return d.value; });
            
            disks.enter()
                .append("svg:rect")
                .attr("width", width)
                .attr("height", block_height)
                .attr("rx", rounding_radius)
                .attr("ry", rounding_radius)
                .attr("fill", color);

            disks.exit().remove();

            disks.attr("x", x)
                .attr("y", y);
        }

        var moves = Hanoi.solver(n);
        
        var state = moves.shift();
        
        draw(state);

        setInterval(function() {
            if(state = moves.shift()) { redraw(state); }
        }, step_length);
    };

});