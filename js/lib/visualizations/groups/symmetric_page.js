define(['deps/under',
        'lib/utilities',
        'deps/d3',
        'lib/miscellaneous/graphics_2d/grid',
        'lib/visualizations/groups/cayley_table',
        'lib/visualizations/groups/symmetric_presenter', 
        'lib/utilities/d3_helper'], 
       function(underscore, utilities, d3, Grid, CayleyTable, SymmetricPresenter, d3_helper) {

           var _ = underscore._;

           return function() { 

               var h = screen.availHeight - 50;
               var w = screen.availWidth - 50;

               var canvas = d3_helper.create_canvas(w, h);
               
               var edge = 35;            
               var grid = new Grid('unbounded', edge);
               var symmetric_presentation = SymmetricPresenter(4, grid);
               var group = symmetric_presentation.group;
               var radius = ((group.order + 1) * edge) / 10;
               var offset = 58;
               var element_color_symmetric = function(d) { return d3.hsl((d.value.id / group.order) * 360, 1, 1/2); }
               
               var g = canvas
                   .append("svg:g")
                   .attr("id", group.name)
                   .attr("transform", utilities.translation(offset, offset));

               CayleyTable(group, grid, element_color_symmetric, function(selection, element) { 
                   var font_em = ".75em";
                   if(element) {
                       selection 
                           .text(element.toString());
                   } else { 
                       selection
                           .style("font-size", font_em)
                           .text(function(e) { return e.value.toString(); });
                   }
               }).draw_cayley_table(g);

               symmetric_presentation.draw_permutation(canvas, { id: 'original', element: group.elements[0] }, (group.order + 1) * edge + offset + radius, offset + 2 * radius);
               symmetric_presentation.draw_permutation(canvas, { id: 'b', element: group.elements[0] }, (group.order + 1) * edge + offset + radius, offset + 5 * radius);
               symmetric_presentation.draw_permutation(canvas, { id: 'ab', element: group.elements[0] }, (group.order + 1) * edge + offset + radius, offset + 8 * radius);
               symmetric_presentation.draw_transition(canvas, 'original', 'b');
               symmetric_presentation.draw_transition(canvas, 'b', 'ab');

               g.selectAll("rect.cell").on("mouseover.symmetric", function(d) { 
                   var a = group.elements[d.y - 1];
                   var b = group.elements[d.x - 1];
                   symmetric_presentation.redraw_permutation(canvas, { id: 'b', element: b });                
                   symmetric_presentation.redraw_permutation(canvas, { id: 'ab', element: d.value });
                   symmetric_presentation.redraw_transition(canvas, 'original', 'b');
                   symmetric_presentation.redraw_transition(canvas, 'b', 'ab');
               });
           };
       });  
 