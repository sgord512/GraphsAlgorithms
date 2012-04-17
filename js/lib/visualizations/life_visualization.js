define(['deps/under', 'deps/d3', 'lib/miscellaneous/grid', 'lib/miscellaneous/life'], function(underscore, d3, Grid, Life) {

    var _ = underscore._;
    var d3 = d3;

    var configurations = {
        'f_pentomino': [[15,15],
                        [14,16],
                        [15,16],
                        [16,16],
                        [14,17],
                        [35,35],
                        [34,36],
                        [35,36],
                        [36,36],
                        [34,37]],
        'blinker': [[0,1],
                    [1,1],
                    [2,1]],

        'acorn': [[24,22],
                  [22,23],
                  [24,23],
                  [23,25],
                  [24,26],
                  [24,27],
                  [24,28],
                  [40,46],
                  [40,46],
                  [44,47],
                  [35,35],
                  [34,36],
                  [35,36],
                  [36,36],
                  [34,37]],

        'gun': [[38,32],
                [37,34],
                [38,34],
                [34,36],
                [35,36],
                [36,36],
                [33,38],
                [34,38],
                [35,38],
                [34,39]]
    }

    var unit_size = 20;
    var h = screen.height - 10;
    var w = screen.width - 10;
    var step = 50;

    return function() { 

        var grid = Grid('unbounded', unit_size);

        var rows = Math.floor(h / unit_size);
        var cols = Math.floor(w / unit_size);

        var life = new Life({ x: cols, y: rows, mode: 'toroidal', initial_state: configurations['gun'] });

        var canvas = d3.select("#sketchpad")
            .append("svg:svg")
            .attr("height", h)
            .attr("width", w)
            .attr("shape-rendering", 'geometricPrecision');

        grid.draw_grid_lines(canvas);

        var draw = function(board) {

            var rows = canvas
                .append("svg:g")
                .classed("container", true)
                .selectAll("g")
                .data(board)
                .enter()
                .append("svg:g")
                .classed("row", true);
            
            var cell = rows.selectAll("rect")
                .data(function(d) { return d; })
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

        var redraw = function(board) {
            var rows = canvas.selectAll("g.container g.row")
                .data(board);

            var cells = rows.selectAll("rect")
                .data(function(d) { return d; })
                .attr("fill", function(d) { return (d.cell === 1) ? 'black' : 'white'; })
                .attr("id", function(d) { return d.cell; });
           }

        draw(life.board());

        setInterval(function() {
            redraw(life.update());
        }, step);
        
    };

});