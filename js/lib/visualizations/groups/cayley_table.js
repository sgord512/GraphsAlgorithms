define(['deps/under', 'lib/utilities', 'deps/d3', 'lib/miscellaneous/graphics_2d/grid'], function(underscore, utilities, d3, Grid) {

    var _ = underscore._;

    return function(group, grid, generate_element_color, generate_element_name) {

        var element_label = generate_element_name || function(selection, d) { 
            if(d) { 
                return selection.text(d.toString()); 
            } else {
                return selection.text(function(d) { return d.value.toString(); }); 
            }
        };
        var element_color = generate_element_color || function(d) { return d3.hsl((d.value.id / group.n) * 360, 1, 1/2); };

        var make_display_table = function() {
            var table = group.group_multiplication_table();
            
            var indexed_table = [];
            _.each(table, function(row, i) { 
                indexed_table[i] = [];
                _.each(table[i], function(cell, j) {
                    indexed_table[i][j] = { y: i + 1, x: j + 1, value: cell };
                });
            });

            var header_row = [];
            _.each(group.elements, function(e, i) {
                header_row[i] = { y: 1, x: i + 1, value: e };
            });

            var header_column = [];
            _.each(group.elements, function(e, i) {
                header_column[i] = { y: i + 2, x: 0, value: e };
            });
            
            return { header_row: header_row,
                     header_column: header_column,
                     table: indexed_table,
                     id: group.name,
                     description: "Cayley Table for: " + group.long_name
                   }
        }

        var x = function(d) { return grid.x(d.x - 1); }
        var y = function(d) { return grid.y(d.y - 1); }

        var draw_table = function(g) {

            var display_table = make_display_table();

            var entries = g.append("svg:g")
                .attr("class", "entries");
            
            var header_row = g.append("svg:g")
                .attr("class", "header_row")
                .selectAll("text")
                .data(display_table.header_row)
                .enter()
                .append("svg:text")
                .attr("x", function(d) { return x(d) + 1; })
                .attr("y", function(d) { return y(d) - 5; })
                .style("font-family", "sans-serif")
                .style("text-anchor", "start")
                .style("alignment-baseline", "top")
                .style("fill", d3.rgb("black"))
                .call(element_label);
            
            var header_column = g.append("svg:g")
                .attr("class", "header_column")
                .selectAll("text")
                .data(display_table.header_column)
                .enter()
                .append("svg:text")
                .attr("x", function(d) { return x(d) + grid.unit - 5; })
                .attr("y", function(d) { return y(d) - 1; })
                .style("font-family", "sans-serif")
                .style("text-anchor", "end")
                .style("alignment-baseline", "bottom")
                .style("fill", d3.rgb("black"))
                .call(element_label);
            
            var row = entries.selectAll("g.row")
                .data(display_table.table)
                .enter()
                .append("svg:g")
                .attr("class", "row");
            
            var cell = row.selectAll("rect")
                .data(function(d) { return d; })
                .enter()
                .append("svg:rect")         
                .attr("class", "cell")
                .attr("x", x)
                .attr("y", function(d) { return y(d) - 1; })
                .attr("width", grid.unit)
                .attr("height", grid.unit)
                .attr("stroke", d3.rgb("lightgrey"))
                .attr("stroke-width", 2)
                .attr("fill", element_color)
                .on("mouseover.equation", function(d) {
                    var a = group.elements[d.y - 1];
                    var b = group.elements[d.x - 1];
                    var equation = g.select("g.label > text.equation");
                    equation.select("tspan.a").call(element_label, a);
                    equation.select("tspan.b").call(element_label, b);
                    equation.select("tspan.c").call(element_label, d.value);
                });

            var equation = g.append("svg:g")
                .attr("class", "label")
                .attr("transform", utilities.translation((group.elements.length * grid.unit) / 2 ,(group.elements.length + 1) * grid.unit))
                .append("svg:text")
                .attr("class","equation")
                .attr("text-anchor", "middle");
            

            equation.append("svg:tspan")
                .attr("class", "a")
                .text("_");
            equation.append("svg:tspan")
                .text(" * ");
            equation.append("svg:tspan")
                .attr("class", "b")
                .text("_");
            equation.append("svg:tspan")
                .text(" = ");
            equation.append("svg:tspan")
                .attr("class", "c")
                .text("_");
        }

        var draw_cayley_table = function(g) { 
            draw_table(g);
        }

        return { 
            draw_cayley_table: draw_cayley_table 
        };
        
    }     

});