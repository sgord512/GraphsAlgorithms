/*
  TODO: Implement the rotated and reflected versions of the group.
  TODO: Have some kind of highlighting on the table when you mouseover an element
  TODO: Show normal subgroups or something like that. 
  TODO: Extend all of this nonsense to other groups than just the dihedral groups
*/
define(['deps/under',
        'lib/utilities',
        'deps/d3',
        'lib/miscellaneous/graphics_2d/grid',
        'lib/visualizations/groups/cayley_table',
        'lib/miscellaneous/groups/quaternion_group',
        'lib/visualizations/groups/dihedral'
       ], function(underscore, utilities, d3, Grid, CayleyTable, QuaternionGroup, DihedralPresenter) {

    var _ = underscore._;

    return function() { 

        var displayed_group = "Quaternion Group"
//        var displayed_group = "Dihedral Group"
        var n = 4;
        var h = screen.availHeight - 50;
        var w = screen.availWidth - 50;
        var edge = 40;
        var radius = (2 * (n + 1) * edge) / 10;
        var offset = 40;
        var grid = Grid('unbounded', edge);

        var canvas = d3.select("#sketchpad")
            .append("svg:svg")
            .attr("height", h)
            .attr("width", w)
            .attr("shape-rendering", 'geometricPrecision');
        

        if(displayed_group === "Quaternion Group") {

            var quaternion_group = new QuaternionGroup();
            var element_color_quaternion = function(d) { return d3.hsl(((Math.floor(d.value.id / 2) / (quaternion_group.n / 2)) + d.value.negative) * 180, 1, 1/2); }

            var g = canvas
                .append("svg:g")
                .attr("id", quaternion_group.name)
                .attr("transform", utilities.translation(offset, offset));

            CayleyTable(quaternion_group, grid, element_color_quaternion).draw_cayley_table(g);

        } else if(displayed_group === "Dihedral Group") { 

            var dihedral_presentation = DihedralPresenter(n, radius);        
            var element_color = function(d) { return d3.hsl(((d.value.r / dihedral_presentation.group.n) + d.value.s) * 180, 1, 1/2); }
            var group = dihedral_presentation.group;

            var g = canvas
                .append("svg:g")
                .attr("id", group.name)
                .attr("transform", utilities.translation(offset, offset));
            
            CayleyTable(group, grid, element_color, dihedral_presentation.generate_element_name).draw_cayley_table(g);

            dihedral_presentation.draw_polygon(canvas, { id: 'original', element: group.elements[0] }, 2 * (group.n + 1) * edge + offset + radius, offset + 2 * radius);
            dihedral_presentation.draw_polygon(canvas, { id: 'b', element: group.elements[0] }, 2 * (group.n + 1) * edge + offset + radius, offset + 5 * radius);
            dihedral_presentation.draw_polygon(canvas, { id: 'ab', element: group.elements[0] }, 2 * (group.n + 1) * edge + offset + radius, offset + 8 * radius);

            g.selectAll("rect.cell").on("mouseover.dihedral", function(d) { 
                var a = group.elements[d.y - 1];
                var b = group.elements[d.x - 1];
                dihedral_presentation.redraw_polygon(canvas, { id: 'b', element: b });
                dihedral_presentation.redraw_polygon(canvas, { id: 'ab', element: d.value });
            });
        }


    };
});  
 