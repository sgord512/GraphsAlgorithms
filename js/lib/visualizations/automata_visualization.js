define(['deps/under', 'deps/d3', 'lib/miscellaneous/grid', 'lib/miscellaneous/elementary_automata'], function(underscore, d3, Grid, CA) {

    var _ = underscore._;
    var d3 = d3;

    var unit_size = 5;
    var h = screen.height - 10;
    var w = screen.width - 10;
    var step = 50;

    return function() { 

        var grid = Grid('unbounded', unit_size);

        var rows = Math.floor(h / unit_size);
        var cols = Math.floor(w / unit_size);

        var ca = new CA({ x: cols, rules: 30, mode: 'toroidal', initial_state: 'random' });

        var canvas = d3.select("#sketchpad")
            .append("svg:svg")
            .attr("height", h)
            .attr("width", w)
            .attr("shape-rendering", 'geometricPrecision');

        grid.draw_grid_lines(canvas);

        var draw = function(history) {

            var generations = canvas
                .append("svg:g")
                .classed("container", true)
                .selectAll("g")
                .data(history, function(d) { return d.generation_number; })
                .enter()
                .append("svg:g")
                .classed("row", true);
            
            var cell = generations.selectAll("rect")
                .data(function(d) { return d.cells; })
                .enter()
                .append("svg:rect");

            cell.attr("x", function(d) { return grid.x(d.x); })
                .attr("y", function(d) { return grid.y(d.y); })
                .attr("width", grid.unit)
                .attr("height", grid.unit)
                .attr("stroke", 'lightgrey')
                .attr("stroke-width", 1)
                .attr("fill", function(d) { return (d.cell === 1) ? 'black' : 'white'; });            
        }

        var redraw = function(history) {
            var rows = canvas.select("g.container")
                .selectAll("g.row")
                .data(history, function(d) { return d.generation_number; })
                .enter()
                .append("svg:g")
                .classed("row", true);
            

            var cell = rows.selectAll("rect")
                .data(function(d) { return d.cells; })
                .enter()
                .append("svg:rect");
            
            cell.attr("x", function(d) { return grid.x(d.x); })
                .attr("y", function(d) { return grid.y(d.y); })
                .attr("width", grid.unit)
                .attr("height", grid.unit)
                .attr("stroke", 'lightgrey')
                .attr("stroke-width", 1)
                .attr("fill", function(d) { return (d.cell === 1) ? 'black' : 'white'; });            
           }

        draw(ca.total_history());

        setInterval(function() {
            redraw(ca.update());
        }, step);
        
    };

});