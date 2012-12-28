define(['deps/under', 'lib/utilities', 'deps/d3', 'lib/miscellaneous/graphics_2d/grid', 'lib/miscellaneous/cellular_automata/life', 'lib/utilities/d3_helper'], function(underscore, utilities, d3, Grid, Life, d3_helper) {

    var _ = underscore._;
    var d3 = d3;

    var unit_size = 20;
    var h = screen.availHeight - 200;
    var w = screen.availWidth - 50;
    var step = 50;
    var padding = 0;

    var default_pattern = 'acorn';

    return function() { 

        var rows = Math.floor(h / unit_size);
        var cols = Math.floor(w / unit_size);

        if(rows > cols) { rows = cols; } else { cols = rows; }

        var grid = new Grid('bounded', { columns: cols, rows: rows, h: rows * unit_size, w: cols * unit_size });

        var key = function(d) { return "x" + d.x + "y" + d.y; };

        var life = new Life({ x: cols, y: rows, mode: 'toroidal', initial_state: Life.patterns[default_pattern] });

        var canvas = d3_helper.create_canvas(grid.w, grid.h);

        var g = canvas.append("svg:g").attr("transform", utilities.translation(padding, padding));

        var draw = function(cells) {
            
            var cell = g.selectAll("rect")
                .data(cells, key)

            cell.enter().append("svg:rect")
                .attr("x", function(d) { return grid.x(d.x); })
                .attr("y", function(d) { return grid.y(d.y); })
                .attr("width", grid.unit_w)
                .attr("height", grid.unit_h)
                .attr("fill", "black");

            cell.exit().remove();
        }

        draw(life.living_cells());

        grid.draw_grid_lines(canvas).attr("transform", utilities.translation(padding, padding));

        setInterval(function() {
            draw(life.update());
        }, step);

        $("header").after("<p>Starting configuration: </p>");

        $("p").append("<select></select>");
        _.each(Life.patterns, function(pattern, pattern_name) { 
            $("select").append("<option value=\"" + pattern_name + "\"" + ((pattern_name === default_pattern) ? " selected" : "") + ">" + pattern_name + "</option>");
        });

        $("p").append("<button type=\"button\">Go</button>");

        $("button")
            .click(function(e) { 
                var pattern = $("select option:selected").attr("value");
                life = new Life({ x: cols, y: rows, mode: 'toroidal', initial_state: Life.patterns[pattern] });
            });
    };

});