// This is just the life page copied over, I haven't actually got anything working

define(['deps/under', 'lib/utilities', 'deps/d3', 'lib/miscellaneous/graphics_2d/grid', 'lib/miscellaneous/cellular_automata/life'], function(underscore, utilities, d3, Grid, Life) {

    var _ = underscore._;
    var d3 = d3;

    var unit_size = 20;
    var h = screen.availHeight - 200;
    var w = screen.availWidth - 50;
    var step = 50;
    var padding = 0;

    return function() { 

        var rows = Math.floor(h / unit_size);
        var cols = Math.floor(w / unit_size);

        if(rows > cols) { rows = cols; } else { cols = rows; }

        var grid = new Grid('bounded', { columns: cols, rows: rows, h: rows * unit_size, w: cols * unit_size });

        var key = function(d) { return "x" + d.x + "y" + d.y; };

        var life = new Life({ x: cols, y: rows, mode: 'toroidal', initial_state: Life.patterns['acorn'] });

        var canvas = d3.select("#sketchpad")
            .append("svg:svg")
            .attr("height", h)
            .attr("width", w)
            .attr("shape-rendering", 'geometricPrecision');

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
        
    };

});