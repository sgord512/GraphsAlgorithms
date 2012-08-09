define(['deps/under', 'deps/d3', 'lib/miscellaneous/graphics_2d/grid', 'lib/miscellaneous/cellular_automata/elementary_automata', 'lib/utilities/d3_helper'], function(underscore, d3, Grid, CA, d3_helper) {

    var _ = underscore._;
    var d3 = d3;

    var unit_size = 20;
    var h = screen.availHeight - 200;
    var w = screen.availWidth - 50;
    var step = 1000;
    var padding = 0; 
    var duration = step * .75;

    var starting_ca = 30;

    var initial_states = { 'Solo': 'alone', 
                           'Random': 'random'
                         }

    var default_initial_state = 'random'

    return function() { 

        var rows = Math.floor(h / unit_size);
        var cols = Math.floor(w / unit_size);

        if(rows > cols) { rows = cols; } else { cols = rows; }

        var grid = new Grid('bounded', { columns: cols, rows: rows, h: rows * unit_size, w: cols * unit_size });

        var ca = new CA({ x: cols, rules: starting_ca, mode: 'toroidal', initial_state: 'random' });

        var canvas = d3_helper.create_canvas(grid.w, grid.h);

        var initializing_data = false;
        var data = [];

        var initialize_data = function(ca) { 
            data = [];
            data.push(ca.current_generation());
            _.times(rows - 1, function() { data.push(ca.step()); });
            return data;
        }

        var update_data = function(data) { 
            if(data.length >= rows) { data.shift(); }
            data.push(ca.step());
            return data;
        }
            
        var container = canvas.append("svg:g").classed("container", true);

        var draw = function(data) {

            var generations = container.selectAll("g")
                .data(data, function(d) { return d.generation; });

            generations.enter()
                .append("svg:g")
                .classed("row", true)
                .attr("transform", function(d, i) { return d3_helper.transforms.translation(0, grid.y(i + 1)); })
                .transition()
//                .ease("linear")
                .duration(duration)
                .attr("transform", function(d, i) { return d3_helper.transforms.translation(0, grid.y(i)); })

            generations.transition()
//                .ease("linear")
                .duration(duration)
                .attr("transform", function(d, i) { return d3_helper.transforms.translation(0, grid.y(i)); });

            generations.exit()
                .transition()
//                .ease("linear")
                .duration(duration)
                .attr("transform", function(d, i) { return d3_helper.transforms.translation(0, grid.y(i - 1)); })
                .remove();

            var cell = generations.selectAll("rect")
                .data(function(d) { return d.cells; })
                .enter()
                .append("svg:rect")
                .attr("x", function(d, i) { return grid.x(i); })
                .attr("y", 0)
                .attr("width", unit_size)
                .attr("height", unit_size)
                .attr("stroke-width", grid.line_width)
                .attr("stroke", grid.line_color)
                .attr("fill", function(d) { return (d === 1) ? 'black' : 'white'; });            
        }

        var clear_screen = function() { 
            var generations = container.selectAll("g")
                .data([], function(d) { return d.generation; });

            generations.exit().remove();
        }


        initialize_data(ca);

        draw(data);

        setInterval(function() {
            if(!initializing_data) { 
                update_data(data);
                draw(data);
            }
        }, step);

        $("header").after("<p>Wolfram code: </p>")
        $("p").append("<input type=\"text\" value=\"" + starting_ca + "\"></input>");
        $("p").append(" Starting configuration: ")
        $("p").append("<select></select>")
        _.each(initial_states, function(init_state, key) { 
            $("select").append("<option value=\"" + init_state + "\"" + ((init_state === default_initial_state) ? " selected" : "") + ">" + key + "</option>");
        });
        $("p").append("<button type=\"button\">Go</button>");
        $("button")
            .click(function(e) {
                var input_code = parseInt($("input").attr("value"));
                var init_state = $("select option:selected").attr("value");
                if(isNaN(input_code) || input_code >= 256 || input_code < 0) { 
                    $("input").attr("value", ca.code);
                } else {
                    ca = new CA({ x: cols, rules: input_code, mode: 'toroidal', initial_state: init_state });
                    initializing_data = true;
                    initialize_data(ca);
                    clear_screen();
                    draw(data);
                    initializing_data = false;
                }
            });
    };

});