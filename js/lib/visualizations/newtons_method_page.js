define(['deps/under',
        'lib/utilities',
        'deps/d3',
        'lib/algorithms/numerical/newtons_method'],
       function(underscore, utilities, d3, newton) {

           var _ = underscore._;

           return function() { 

               var h = screen.availHeight - 50;
               var w = screen.availWidth - 50; 
               
               var radius = 3;
               var padding = 10;
               var n = 10;
               var number = 64;
               var z = 1;
               var zip_indices = function(arr) {
                   var result = [];
                   for(var i = 0; i < arr.length; i++) {
                       result[i] = { i: i, value: arr[i] };
                   }
                   return result;
               }

               var many_zs = _.map(_.range(1, Math.floor(Math.sqrt(number))), function(i) { 
                   return zip_indices(newton(i)(number).gather_n_iterations(n));
               });

               var color = d3.scale.category10();
               var y_scale = d3.scale.linear().domain([0, d3.max(_.map(many_zs, function(d) { return d3.max(_.pluck(d, 'value')); }))]).range([h - padding, padding]);
               var x_scale = d3.scale.ordinal().domain(_.range(0, n + 1)).rangePoints([padding, w - padding], 1.0);

               var x = function(d) { return x_scale(d.i); }
               var y = function(d) { return y_scale(d.value); }
                   
               var line = d3.svg.line()
                   .x(x)
                   .y(y)
                   .interpolate("cardinal")

               var canvas = d3.select("#sketchpad")
                   .append("svg:svg")
                   .attr("height", h)
                   .attr("width", w)
                   .attr("shape-rendering", 'geometricPrecision');
               
               canvas.append("svg:line")
                   .attr("x1", padding)
                   .attr("x2", padding)
                   .attr("y1", padding)
                   .attr("y2", h - padding)
                   .attr("stroke", "black")               

               canvas.append("svg:line")
                   .attr("x1", padding)
                   .attr("x2", w - padding)
                   .attr("y1", h - padding)
                   .attr("y2", h - padding)
                   .attr("stroke", "black")
               
               var g = canvas.selectAll("g")
                   .data(many_zs)
                   .enter()
                   .append("svg:g")
                   .attr("fill", function(d, i) { return color(i); })



               var curves = g.append("svg:path").attr("d", line).attr("stroke", function(d, i) { return color(i); }).attr("fill", "none");

               var series = g.selectAll("circle")
                   .data(function(d) { return d; })
                   .enter()
                   .append("svg:circle")
                   .attr("cx", x)
                   .attr("cy", y)
                   .attr("r", radius);

           };
       });
               