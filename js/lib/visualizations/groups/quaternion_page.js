define(['deps/under',
        'lib/utilities',
        'deps/d3',
        'lib/miscellaneous/graphics_2d/grid',
        'lib/visualizations/groups/cayley_table',
        'lib/miscellaneous/groups/quaternion_group',
        'lib/utilities/d3_helper'], 
       function(underscore, utilities, d3, Grid, CayleyTable, QuaternionGroup, d3_helper) {

           var _ = underscore._;

           return function() { 
               
               var h = screen.availHeight - 50;
               var w = screen.availWidth - 50; 
               
               var group = new QuaternionGroup();
               var element_color_quaternion = function(d) { return d3.hsl(((Math.floor(d.value.id / 2) / (group.order / 2)) + d.value.negative) * 180, 1, 1/2); }

               var canvas = d3_helper.create_canvas(w, h);
               
               var edge = 40;
               var radius = (2 * (group.order + 1) * edge) / 10;
               var offset = 58;
               var grid = new Grid('unbounded', edge);


               var g = canvas
                   .append("svg:g")
                   .attr("id", group.name)
                   .attr("transform", utilities.translation(offset, offset));

               CayleyTable(group, grid, element_color_quaternion).draw_cayley_table(g);
           };
       });  
