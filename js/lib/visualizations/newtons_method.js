define(['deps/under',
        'lib/utilities',
        'deps/d3',
       function(underscore, utilities, d3) {

           var _ = underscore._;

           return function() { 
               
               var h = screen.availHeight - 50;
               var w = screen.availWidth - 50; 

               var canvas = d3.select("#sketchpad")
                   .append("svg:svg")
                   .attr("height", h)
                   .attr("width", w)
                   .attr("shape-rendering", 'geometricPrecision');

               var point = d3.selectAll("circle")
                   .data(
               
               
               var edge = 40;
               var radius = (2 * (group.order + 1) * edge) / 10;
               var offset = 58;
               var grid = Grid('unbounded', edge);


               var g = canvas
                   .append("svg:g")
                   .attr("id", group.name)
                   .attr("transform", utilities.translation(offset, offset));

               CayleyTable(group, grid, element_color_quaternion).draw_cayley_table(g);
           };
       });  
