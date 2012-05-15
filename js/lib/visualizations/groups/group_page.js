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

        var n = 4;
        var h = screen.availHeight - 50;
        var w = screen.availWidth - 50;
        var edge = 40;
        var radius = (2 * (n + 1) * edge) / 10;
        var offset = 40;
        var grid = Grid('unbounded', edge);
        var quaternion_group = new QuaternionGroup();
        var dihedral_presentation = DihedralPresenter(n, radius);

        var element_color_quaternion = function(d) { return d3.hsl(((Math.floor(d.value.id / 2) / (quaternion_group.n / 2)) + d.value.negative) * 180, 1, 1/2); }
        var element_color = function(d) { return d3.hsl(((d.value.r / dihedral_presentation.group.n) + d.value.s) * 180, 1, 1/2); }

        var canvas = d3.select("#sketchpad")
            .append("svg:svg")
            .attr("height", h)
            .attr("width", w)
            .attr("shape-rendering", 'geometricPrecision');

        var g = canvas
            .append("svg:g")
        // .attr("id", dihedral_presentation.group.name)
            .attr("id", quaternion_group.name)
            .attr("transform", utilities.translation(offset, offset));

        // redraw_polygon({ id: 'b', points: DihedralUtilities.make_display_polygon(b) });
        // redraw_polygon({ id: 'ab', points: DihedralUtilities.make_display_polygon(d.value) });

        // CayleyTable(dihedral_presentation.group, grid, element_color, dihedral_presentation.generate_element_name).draw_cayley_table(g);
        CayleyTable(quaternion_group, grid, element_color_quaternion).draw_cayley_table(g);
        // draw_polygon({ id: 'original', points: DihedralUtilities.make_display_polygon(group.elements[0]) }, 2 * (group.n + 1) * edge + offset + radius, offset + 2 * radius);
        // draw_polygon({ id: 'b', points: DihedralUtilities.make_display_polygon() }, 2 * (group.n + 1) * edge + offset + radius, offset + 5 * radius);
        // draw_polygon({ id: 'ab', points: DihedralUtilities.make_display_polygon() }, 2 * (group.n + 1) * edge + offset + radius, offset + 8 * radius);
    };
});  
 