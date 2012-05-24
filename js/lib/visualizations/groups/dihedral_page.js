define(['deps/under',
        'lib/utilities',
        'deps/d3',
        'lib/miscellaneous/graphics_2d/grid',
        'lib/visualizations/groups/cayley_table',
        'lib/visualizations/groups/dihedral_presenter'], 
       function(underscore, utilities, d3, Grid, CayleyTable, DihedralPresenter) {

           var _ = underscore._;

           return function() { 

               var h = screen.availHeight - 50;
               var w = screen.availWidth - 50;

               var canvas = d3.select("#sketchpad")
                   .append("svg:svg")
                   .attr("height", h)
                   .attr("width", w)
                   .attr("shape-rendering", 'geometricPrecision');

               var n = 8;
               var edge = 40;
               var radius = (2 * (n + 1) * edge) / 10;
               var offset = 40;
               var grid = Grid('unbounded', edge);

               var dihedral_presentation = DihedralPresenter(n, radius);        
               var element_color = function(d) { return d3.hsl(((d.value.r / dihedral_presentation.group.order) + d.value.s) * 180, 1, 1/2); }
               var group = dihedral_presentation.group;

               var g = canvas
                   .append("svg:g")
                   .attr("id", group.name)
                   .attr("transform", utilities.translation(offset, offset));
               
               CayleyTable(group, grid, element_color, dihedral_presentation.generate_element_name).draw_cayley_table(g);

               dihedral_presentation.draw_polygon(canvas, { id: 'original', element: group.elements[0] }, (group.order + 1) * edge + offset + radius, offset + 2 * radius);
               dihedral_presentation.draw_polygon(canvas, { id: 'b', element: group.elements[0] }, (group.order + 1) * edge + offset + radius, offset + 5 * radius);
               dihedral_presentation.draw_polygon(canvas, { id: 'ab', element: group.elements[0] }, (group.order + 1) * edge + offset + radius, offset + 8 * radius);

               g.selectAll("rect.cell").on("mouseover.dihedral", function(d) { 
                   var a = group.elements[d.y - 1];
                   var b = group.elements[d.x - 1];
                   dihedral_presentation.redraw_polygon(canvas, { id: 'b', element: b });
                   dihedral_presentation.redraw_polygon(canvas, { id: 'ab', element: d.value });
               });

           };
       });  
