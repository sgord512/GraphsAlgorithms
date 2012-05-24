define(["deps/under", "deps/d3"], function(underscore) {

    var _ = underscore._;

    var grid_color = "lightgrey";
    var grid_stroke_width = 2;
    
    var default_grid_size = 20;
    
    return function(mode, config) {
        
        if(mode === 'bounded') {
            if(!config) { throw new Error("No configuration object provided!"); }
            var h = config.h;
            var w = config.w;
            var columns = config.columns;
            var rows = config.rows;
            if(!(h && w && columns && rows)) { throw new Error("Configuration missing something!"); }
            
            var unit_w = columns / w;
            var unit_h = rows / h;

        } else if(mode === 'unbounded') {

            var unit = config || default_grid_size;
            var unit_w = config || default_grid_size;
            var unit_h = config || default_grid_size;

        } else { throw new Error("Unknown mode entered"); }

        var x = function(x) { return x * unit_w; };
        var y = function(y) { return y * unit_h; };

        var draw_grid_lines = function(canvas) { 
            var canvas_h = canvas.attr("height");
            var canvas_w = canvas.attr("width");
            var num_col_lines = Math.ceil(canvas_w / unit_w);
            var num_row_lines = Math.ceil(canvas_h / unit_h);
            
            var columns = _.map(_.range(-1, num_col_lines), x);
            var rows = _.map(_.range(-1, num_row_lines), y);

            canvas.append("svg:g").classed("vertical_lines", true)
                .selectAll("line")
                .data(columns)
                .enter()
                .append("svg:line")
                .attr("x1", function(d) { return d; })
                .attr("x2", function(d) { return d; })
                .attr("y1", 0 - unit_h)
                .attr("y2", canvas_h)
                .style("stroke", grid_color)
                .style("stroke-width", grid_stroke_width);

            canvas.append("svg:g").classed("horizontal_lines", true)
                .selectAll("line")
                .data(rows)
                .enter()
                .append("svg:line")
                .attr("y1", function(d) { return d; })
                .attr("y2", function(d) { return d; })
                .attr("x1", 0 - unit_w)
                .attr("x2", canvas_w)
                .style("stroke", grid_color)
                .style("stroke-width", grid_stroke_width);
        }

        return {
            line_width: grid_stroke_width,
            line_color: grid_color,
            unit: unit,
            w: w,
            h: h,
            x: x,
            y: y,
            draw_grid_lines: draw_grid_lines,
            coord: function(p) { return { x: x(p.x), y: y(p.y) }; },
            coord_rect_middle: function(p) { return { x: x(p.x) + unit_w / 2, y: y(p.y) + unit_h / 2 }; }
        }
    };

});