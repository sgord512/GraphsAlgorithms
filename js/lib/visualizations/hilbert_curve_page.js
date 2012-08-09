define(['deps/under', 'lib/utilities', 'deps/d3', 'lib/miscellaneous/graphics_2d/hilbert', 'lib/utilities/d3_helper'], function(underscore, utilities, d3, Hilbert, d3_helper) {

    var _ = underscore._;

    return function() { 

        var h = screen.availHeight - 50;
        var w = screen.availWidth - 50;
        var n_max = 8;
        var color = "black";
        var stroke_width = 2;
        var step = 200;
        var padding = 10;
        var canvas_size = ((h > w) ? w : h);
        var size = canvas_size - 2 * padding
        var directions = ['N','E','S','W'];

        var new_direction = function(curr, turnRight) { 
            var i = _.indexOf(directions, curr);
            var next_i = (turnRight ? (i + 1) : (i - 1)) % directions.length;
            if (next_i < 0) { next_i += directions.length; }
            return directions[next_i];
        }

        var directional_line = function(dir) {
            var zero = "0 ";
            var neg = function(n) {
                return 0 - n; 
            }
            var pr = function(n) { 
                return String(n) + " "; 
            }
            return function(dim) {
                var str = "l ";
                if(dir === 'N') {
                    str += zero + pr(neg(dim));
                } else if(dir === 'E') { 
                    str += pr(dim) + zero
                } else if(dir === 'S') {
                    str += zero + pr(dim);
                } else if(dir === 'W') {
                    str += pr(neg(dim)) + zero;
                }
                return str;
            }
        }

        var hilbert_curve = function(n) { 
            var division = Math.pow(2, n);
            var unit = size / division;

            var path = "M " + (unit / 2) + " " + (unit / 2) + " ";
            var str = Hilbert.string(n);
            var dir = 'E';
            for(var i = 0; i < str.length; i++) {
                var c = str[i];
                if(c === '+') { dir = new_direction(dir, true); }
                else if(c === '-') { dir = new_direction(dir, false); }
                else if(c === 'F') { 
                    var line = directional_line(dir);
                    path = path + line(unit);
                }
            }
            return path;
        }

        var curves = _.map(_.range(1, n_max + 2), function(n) { return hilbert_curve(n); });


        var canvas = d3_helper.create_canvas(canvas_size, canvas_size);

        var next_n = function() { 
            var ascending = true;
            return function(n) { 
                var next;
                if(ascending) { 
                    next = n + 1;
                    if(next === n_max + 1) { ascending = false; }
                } else {
                    next = n - 1;
                    if(next === 1) { ascending = true; }
                }
                return next;
            }
        }();

        var redraw_curve = function(n) { 
            curve
                .attr("d", curves[n - 1])
                .attr("stroke-width", (n > n_max) ? 1 : stroke_width);
        }

        var g = canvas
            .append("svg:g")
            .attr("transform", utilities.translation(padding, padding));

        var curve = g
            .append("svg:path")
            .attr("d", curves[0])
            .attr("stroke", color)
            .attr("stroke-width", stroke_width)
            .attr("fill", "none");

        setInterval(function() {
            var curr_n = 1;
            return function() { 
                redraw_curve(curr_n);
                curr_n = next_n(curr_n);
            }
        }(), step);
    }

}); 

        
      