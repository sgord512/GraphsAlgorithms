define(['deps/under', 'lib/utilities', 'deps/d3', 'lib/miscellaneous/groups/dihedral_group', 'lib/miscellaneous/graphics_2d/polygons'], function(underscore, utilities, d3, DihedralGroup, Polygons) {

    var _ = underscore._;

    return function(n, radius) { 

        var group = new DihedralGroup(n);

        var original_polygon = Polygons.regular_n_gon(group.n, radius);

        var vertex_color = function(d) { 
            return d3.hsl((d.i / group.n) * 360, 1, 1/2);
        }

        var generate_element_name = function(selection, element) {
            var em = ".75em";
            if(element) { 
                selection.text(letter_string({ value: element }))
                    .append("svg:tspan")
                    .style("baseline-shift", "super")
                    .style("font-size", em)
                    .text(number_string({ value: element }));
            } else {
                selection.text(letter_string)
                    .append("svg:tspan")
                    .style("baseline-shift", "super")
                    .style("font-size", em)
                    .text(number_string);
            }
        }

        var number_string = function(d) { 
            var number = d.value.toString().match(/[a-z]+\^(\d+)/);
            if(number && number[1] !== "1") { return number[1]; }
            else { return ""; }
        }

        var letter_string = function(d) { 
            var letters = d.value.toString().match(/([a-z]+)\^\d+/);
            if(letters) { return letters[1]; }
            else { return d.value.toString(); }
        }

        var make_display_polygon = function(element) { 
            var vertices = _.range(1, group.n + 1);

            var element = element || { r: 0, s: 0 };
            
            for(var i = 0; i < element.r; i++) {
                vertices = Polygons.rotate_one_nth(vertices);
            }

            if(element.s) { 
                console.log(element.toString());
                vertices = Polygons.reflect_around_1(vertices); }
            
            var indexed_polygon = [];
            _.each(original_polygon, function(point, i) { 
                indexed_polygon[i] = { y: point[1], x: point[0], i: vertices[i] };
            });

            return indexed_polygon;
        }

        var redraw_polygon = function(canvas, d) { 
            var points = make_display_polygon(d.element);
            
            canvas.selectAll("g#" + d.id + " > circle")
                .data(points)
                .attr("fill", vertex_color);
        }

        var draw_polygon = function(canvas, d, x, y) {
            var points = make_display_polygon(d.element);
            
            var g = canvas.append("svg:g")
                .attr("id", d.id)
                .attr("transform", utilities.translation(x, y));

            var points_string = _.reduce(points, function(str, p) { return str + p.x + "," + p.y + " "; }, "");

            var polygon = g.append("svg:polygon")
                .attr("class", "polygon")
                .attr("points", points_string)
                .attr("fill", d3.rgb("black"))
                .attr("stroke-width", 3)
                .attr("stroke", d3.rgb("lightgrey"));
                        
            g.selectAll("circle")
                .data(points)
                .enter()
                .append("svg:circle")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", radius / 4)
                .attr("fill", vertex_color)
                .attr("stroke-width", 2)
                .attr("stroke", d3.rgb("lightgrey"));
        }

        return {
            generate_element_name: generate_element_name,
            group: group,
            redraw_polygon: redraw_polygon,
            draw_polygon: draw_polygon
        };

    };

});  
