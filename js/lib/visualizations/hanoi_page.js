define(['lib/miscellaneous/hanoi', 'deps/d3', 'deps/under', 'lib/utilities', 'lib/utilities/d3_helper'], function(Hanoi, d3, underscore, utilities, d3_helper) {

    var _ = underscore._;

    return function() { 

        var keymap = { 49: 'a', 50: 'mid', 51: 'b', 38: 'up', 40: 'down' }
        
        var step_length = 50;
        var h = screen.availHeight - 100;
        var w = screen.availWidth - 50;
        var n = 8;
        var number_of_pegs = 3;
        var rounding_radius = 20;
        var separation_factor = 1/6;
        var padding = separation_factor / 2;
        var block_height = (h / n) * (1 - separation_factor);
        var block_width = (w / number_of_pegs) * (1 - separation_factor);

        var canvas = d3_helper.create_canvas(w, h);

        var y_interpolator = d3.interpolate((h - (h / n)) - padding, padding); 
        var y = function(d) { return y_interpolator(d.position / n); }

        var width_interpolator = d3.interpolate(1/3, 1);
        var width = function(d) { return width_interpolator(d.value.size / n) * block_width; }
        var x = function(d) { return (block_width - width(d)) / 2; }

        var color_interpolator = d3.interpolate(d3.rgb("red"), d3.rgb("blue"));
        var color = function(d) { return color_interpolator(d.value.size / n); }

        var mode = "standard"

        var Move = function() {
            this.clear();
        }

        Move.prototype.clear = function() {
            this.to = undefined;
            this.from = undefined;
            this.number_disks = 0;
            return this;
        }
        
        Move.prototype.update = function(key) {            
            if(!this.from) { 
                this.from = key; 
                this.number_disks = 1;
            } else {
                if(this.from === key) { this.clear(); }
                else { this.to = key; }
            }
            return move;
        }
        
        Move.prototype.ready = function() { 
            return this.to && this.from && this.to !== this.from;
        }

        Move.prototype.toString = function() {
            return this.number_disks + " from " + this.from + " to " + this.to;
        }

        
        var draw = function(pegs) {
            
            var groups = canvas
                .selectAll("g")
                .data(pegs, function(d) { return d.name });

            groups.exit().remove();

            groups
                .enter()
                .append("svg:g")
                .attr("id", function(d) { return d.name })
                .attr("transform", function(d, i) { return utilities.translation(w * (i / number_of_pegs) + separation_factor * w/3, 0) });
            
            var disks = groups
                .selectAll("rect")
                .data(function(d) { return d.value; });

            disks.exit().remove()

            disks.enter()
                .append("svg:rect");

            disks
                .attr("x", x)
                .attr("y", y)
                .attr("width", width)
                .attr("height", block_height)
                .attr("rx", rounding_radius)
                .attr("ry", rounding_radius)
                .attr("fill", color)
                .attr("stroke", "black")
                .attr("stroke-width", 1);
            
        }

        var redraw = function(pegs, move) {

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
                .attr("fill", color)
                .attr("stroke", "black")
                .attr("stroke-width", 1);

            disks.exit().remove();

            disks.attr("x", x)
                .attr("y", y)
                .attr("stroke-width", 1);
            

            if(move.from) {
                var selectedGroup = canvas.select("g#" + move.from);
                for(var i = 1; i <= move.number_disks; i++) {
                    selectedGroup.select("rect:nth-last-child(" + i + ")")
                        .attr("stroke", "black")
                        .attr("stroke-width", 5);
                }
            }
                
        }

        var hanoi = new Hanoi();
        var move = new Move();
        draw(hanoi.record_state());

        var reset = function(mode) { 
            hanoi = new Hanoi(Hanoi.variants[mode]);
            draw(hanoi.record_state(), move.clear());
            console.log("Resetting");
        }

        $("header").after("<button type=\"button\">Reset</button>");
        $("button")
            .click(function(e) { 
                reset(mode);
            });

        $("button").after("<select></select>");
        _.each(Hanoi.variants, function(mode, key) { 
            $("select").append("<option value=\"" + key + "\">" + mode.name + "</select>");
        });

        $("select").change(function(e) { 
            mode = $("select option:selected").attr("value");
            reset(mode);
        });

        $(document).keydown(function(e) { 
            if(e.which === 38 || e.which === 40) { e.preventDefault(); }
            if(keymap[e.which]) {
                move.update(keymap[e.which]);
                console.log("Move from " + move.from + " to " + move.to);

                if(move.ready()) { 
                    console.log("Sending move: " + move.toString());
                    if(hanoi.is_valid_move(move)) { 
                        console.log("Move accepted");
                        hanoi.move_disk(move); }
                    move.clear();
                }

                redraw(hanoi.record_state(), move);
            }
        });


    };

});