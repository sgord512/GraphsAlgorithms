define(['deps/under', 'lib/utilities', 'deps/d3', 'lib/miscellaneous/groups/symmetric_group'], function(underscore, utilities, d3, SymmetricGroup) {

    var _ = underscore._;

    return function(n, grid) { 

        var extract_coordinates = function(translation) { 
            var match_arr = translation.match(/translate[(]([\d.]+),([\d.]+)[)]\s*/);
            return { x: Number(match_arr[1]), y: Number(match_arr[2]) };
        }

        var group = new SymmetricGroup(n);

        var rect = _.map(_.range(0, n), function(i) { return [2 * grid.unit * i, 0]; });
        var set = _.range(1, group.n + 1);
        var color_scheme = d3.scale.ordinal().domain(set).range(d3.colorbrewer.Spectral[n]);
        var item_color = function(d) { return color_scheme(d.i); }

        var make_display_permutation = function(element) { 
            var permuted_set = element.act_on_set(set);
            var permutation = [];
            _.each(rect, function(point, i) {
                permutation[i] = { x: point[0], y: point[1], i: permuted_set[i] };
            });

            return permutation;
        }            


        var make_transitions = function(canvas, source, dest) { 

            var source_group = canvas.select("g#" + source);
            var dest_group = canvas.select("g#" + dest);

            var source_data = _.pluck(canvas.selectAll("g#" + source + " > rect")[0], '__data__');
            var dest_data = _.pluck(canvas.selectAll("g#" + dest + " > rect")[0], '__data__');

            var source_translation_coords = extract_coordinates(source_group.attr("transform"));
            var dest_translation_coords = extract_coordinates(dest_group.attr("transform"));

            var point_string = function(arr) { 
                return _.map(arr, function(point) { 
                    return point.join(",");
                }).join(" ");
            }

            var translate_points_by_coords = function(points, coords) { 
                return _.map(points, function(p) { 
                    return [p[0] + coords.x, p[1] + coords.y];
                });
            }

            var connecters = _.map(source_data, function(s) { 
                var source_points = translate_points_by_coords([[s.x,s.y + 2 * grid.unit],[s.x + 2 * grid.unit, s.y + 2 * grid.unit]],
                                                               source_translation_coords);
                
                var d = _.find(dest_data, function(d) { return s.i === d.i });
                var dest_points = translate_points_by_coords([[d.x + 2 * grid.unit, d.y],[d.x, d.y]],
                                                             dest_translation_coords);

                var points = source_points.concat(dest_points);

                return { i: s.i, point_string: point_string(points) };
            });   

            return connecters;

        }

        var redraw_transition = function(canvas, source, dest) { 
            var id = source + "-to-" + dest;
            var connecters = make_transitions(canvas, source, dest);
            var g = canvas.select("g#" + id)
                .selectAll("polygon")
                .data(connecters)
                .attr("points", function(d) { return d.point_string })
                .attr("fill", item_color);

        }

        var draw_transition = function(canvas, source, dest) {
            var id = source + "-to-" + dest;
            var connecters = make_transitions(canvas, source, dest);

            var g = canvas.append("svg:g")
                .attr("id", id);

            var transition_lines = g.selectAll("polygon")
                .data(connecters)
                .enter()
                .append("svg:polygon")
                .attr("points", function(d) { return d.point_string })
                .attr("fill", item_color)
                .attr("fill-opacity", ".5");       
        }

        var redraw_permutation = function(canvas, d) { 
            var permutation = make_display_permutation(d.element);
            canvas.select("g#" + d.id)
                .selectAll("rect")
                .data(permutation)
                .attr("fill", item_color);
        }

        var draw_permutation = function(canvas, d, x, y) {
            
            var permutation = make_display_permutation(d.element);
            var g = canvas.append("svg:g")            
                .attr("id", d.id)
                .attr("transform", utilities.translation(x, y));

            var items = g.selectAll("rect")
                .data(permutation)
                .enter()
                .append("svg:rect")
                .attr("class", function(d) { return "a" + d.i; })
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; })
                .attr("height", 2 * grid.unit)
                .attr("width", 2 * grid.unit)
                .attr("fill", item_color)
                .attr("stroke-width", grid.line_width)
                .attr("stroke", grid.line_color)
        }

        return {
            group: group,
            draw_permutation: draw_permutation,
            redraw_permutation: redraw_permutation,
            draw_transition: draw_transition,
            redraw_transition: redraw_transition
        };

    };

});  
