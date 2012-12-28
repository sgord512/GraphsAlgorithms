define(["deps/under", "deps/d3"], function(underscore, d3) {

    var _ = underscore._;

    var default_grid_size = 20;

    var Grid = function(mode, config) {
        this.line_color = "lightgrey";
        this.line_width = 2;
        
        if(mode === 'bounded') {
            this.mode = mode;
            if(!config) { throw new Error("No configuration object provided!"); }
            this.h = config.h;
            this.w = config.w;
            this.columns = config.columns;
            this.rows = config.rows;
            if(!(this.h && this.w && this.columns && this.rows)) { throw new Error("Configuration missing something!"); }
            
            this.unit_w = this.w / this.columns;
            this.unit_h = this.h / this.rows;

        } else if(mode === 'unbounded') {
            this.mode = mode;
            this.unit = config || default_grid_size;
            this.unit_w = config || default_grid_size;
            this.unit_h = config || default_grid_size;

        } else { throw new Error("Unknown mode entered"); }

        var self = this;

        this.x = function(x) { return x * self.unit_w; };
        this.y = function(y) { return y * self.unit_h; };
    }

    Grid.prototype.draw_grid_lines = function(canvas) { 
        var canvas_h, canvas_w, num_col_lines, num_row_lines, column_xs, row_ys;
        if(this.mode === 'bounded') { 
            canvas_h = this.h;
            canvas_w = this.w;
            num_col_lines = this.columns + 1;
            num_row_lines = this.rows + 1;
            column_xs = _.map(_.range(0, num_col_lines), this.x);
            row_ys = _.map(_.range(0, num_row_lines), this.y);
        } else if(this.mode === 'unbounded') {
            canvas_h = canvas.attr("height");
            canvas_w = canvas.attr("width");
            num_col_lines = Math.ceil(canvas_w / this.unit_w);
            num_row_lines = Math.ceil(canvas_h / this.unit_h);
            column_xs = _.map(_.range(-1, num_col_lines), this.x);
            row_ys = _.map(_.range(-1, num_row_lines), this.y);
        }

        var g = canvas.append("svg:g").classed("grid", true);
        
        g.append("svg:g").classed("vertical_lines", true)
            .selectAll("line")
            .data(column_xs)
            .enter()
            .append("svg:line")
            .attr("x1", function(d) { return d; })
            .attr("x2", function(d) { return d; })
            .attr("y1", 0 - this.unit_h)
            .attr("y2", canvas_h)
            .style("stroke", this.line_color)
            .style("stroke-width", this.line_width);

        g.append("svg:g").classed("horizontal_lines", true)
            .selectAll("line")
            .data(row_ys)
            .enter()
            .append("svg:line")
            .attr("y1", function(d) { return d; })
            .attr("y2", function(d) { return d; })
            .attr("x1", 0 - this.unit_w)
            .attr("x2", canvas_w)
            .style("stroke", this.line_color)
            .style("stroke-width", this.line_width);

        return g;
    }

    Grid.prototype.coord = function(p) { return { x: this.x(p.x), y: this.y(p.y) }; };

    Grid.prototype.coord_rect_middle = function(p) { return { x: this.x(p.x) + this.unit_w / 2, y: this.y(p.y) + this.unit_h / 2 }; }

    return Grid;

}); 