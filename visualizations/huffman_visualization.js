define(['underscore-1.3.1', 'jquery-1.7.1', 'd3/d3', 'huffman'], function(underscore, $, d3, Huffman) {

    var _ = this._;
    var $ = this.$;
    var d3 = this.d3;

    return function() { 

        $(document).ready(function() {
            
            var h = 7/8 * screen.height;
            var w = screen.width - 10;
            var leaf_color = d3.rgb(255, 0, 0);
            var node_color = d3.hsl(0,0,0);
            var step = 1000;
            var padding = 0.01;

            var coloring_function = function(d) {
                if (huffman.isLeaf(d)) { 
                    return leaf_color;
                } else {
                    return node_color;
                } 
            }

            var canvas = d3.select("#sketchpad")
                .append("svg:svg")
                .attr("height", h)
                .attr("width", w);
            
            var freqs = {  'english': {'e': 12.702
                                       ,'t': 9.056 
                                       ,'a': 8.167 
                                       ,'o': 7.507 
                                       ,'i': 6.966 
                                       ,'n': 6.749 
                                       ,'s': 6.327 
                                       ,'h': 6.094 
                                       ,'r': 5.987 
                                       ,'d': 4.253 
                                       ,'l': 4.025 
                                       ,'c': 2.782 
                                       ,'u': 2.758 
                                       ,'m': 2.406 
                                       ,'w': 2.360 
                                       ,'f': 2.228 
                                       ,'g': 2.015 
                                       ,'y': 1.974 
                                       ,'p': 1.929 
                                       ,'b': 1.492 
                                       ,'v': 0.978 
                                       ,'k': 0.772 
                                       ,'j': 0.153 
                                       ,'x': 0.150 
                                       ,'q': 0.095 
                                       ,'z': 0.074 } 
                           ,'french': {'e': 17.134 
                                       ,'a': 8.122 
                                       ,'s': 7.948 
                                       ,'i': 7.579 
                                       ,'t': 7.244 
                                       ,'n': 7.095 
                                       ,'r': 6.553 
                                       ,'u': 6.369 
                                       ,'l': 5.456 
                                       ,'o': 5.398 
                                       ,'d': 3.669 
                                       ,'c': 3.345 
                                       ,'p': 3.021 
                                       ,'m': 2.968 
                                       ,'v': 1.628 
                                       ,'q': 1.362 
                                       ,'f': 1.066 
                                       ,'b': 0.901 
                                       ,'g': 0.866 
                                       ,'h': 0.737 
                                       ,'j': 0.545 
                                       ,'x': 0.387 
                                       ,'y': 0.308 
                                       ,'z': 0.136 
                                       ,'w': 0.114 
                                       ,'k': 0.049 } }
            
            var huffman = Huffman.initialize(freqs.english);            

            var transform_string = function(x, y) {
                return "translate(" + x + "," + y + ") ";
            }

            var create_y_function = function(max_h) { 
                var scale_y = d3.scale.ordinal()
                    .domain(_.range(0, max_h + 1))
                    .rangeBands([0,h], padding);
                
                return function(d) {
                    return scale_y(d.depth) + scale_y.rangeBand() / 2;
                };
            }
                
            var create_scale_x = function(nodes) { 
                return d3.scale.ordinal()
                    .domain(nodes)
                    .rangeBands([0,w], padding);
            }

            var create_x_function_from_roots = function(roots) { 
                var root_scale_x = create_scale_x(roots);
                return function(d) {
                    var root_interval = [ root_scale_x(d.root())
                                        , root_scale_x(d.root()) + root_scale_x.rangeBand()];
                    var layer_scale_x = d3.scale.ordinal()
                        .domain(_.range(0, Math.pow(2, d.depth)))
                        .rangeBands(root_interval, padding);
                    return layer_scale_x(d.layer_offset()) + layer_scale_x.rangeBand() / 2; 
                }
            }

            var create_scale_r = function(nodes) { 
                var scale_x = create_scale_x(nodes);              
                var upper_limit = scale_x.rangeBand() / 2;
                return d3.scale.sqrt()
                    .domain([_.min(_.pluck(nodes, 'freq')), _.max(_.pluck(nodes, 'freq'))])
                    .range([0, upper_limit]);
            }

            function create(empty, x, y, scale_r) {
                var groups = empty.append("svg:g")                
                    .attr("transform", function(d) { return transform_string(x(d), y(d)) })
                    .attr("opacity", 0);

                groups.append("svg:circle")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r", function(d) { return scale_r(d.freq) })
                    .style("fill", coloring_function);

                groups.filter(huffman.isLeaf)
                    .append("svg:text")
                    .style("font-family", "sans-serif")
                    .style("text-anchor", "start")
                    .style("alignment-baseline", "middle")
                    .style("fill", d3.hsl(0,0,0))
                    .attr("x", function(d) { return scale_r(d.freq) })
                    .attr("y", function(d) { return scale_r(d.freq) })
                    .text(function(d) { return d.letter });

                groups.transition()
                    .delay(.50 * step)
                    .duration(.25 * step)
                    .attr("opacity", 1);

            }

            function draw(huff) {
                
                var nodes = huff.nodes();

                var max_h = _.max(_.pluck(nodes, 'height'));

                var groups = canvas.selectAll("g")
                    .data(nodes, function(n) { return n.id });
                
                create(groups.enter(), create_x_function_from_roots(nodes), create_y_function(max_h), create_scale_r(nodes));
            }

            function redraw(huff) {
                var nodes = huff.nodes();
                var x = create_x_function_from_roots(huff.roots());
                var y = create_y_function(huff.actual_range());
                var scale_r = create_scale_r(nodes);
                var groups = canvas.selectAll("g")
                    .data(nodes, function(n) { return n.id });

                groups.transition()
                    .duration(.25 * step)
                    .attr("transform", function(d) { return transform_string(x(d), y(d)) })
                    .select("circle")
                    .attr("r", function(d) { return scale_r(d.freq) });

                create(groups.enter(), x, y, scale_r);

                groups.exit()
                    .transition()
                    .duration(.25 * step)
                    .attr("opacity", 0)
                    .remove();
                
            }

            draw(huffman);
            
            setInterval(function() {
                if(huffman.update()) { redraw(huffman); };
            }, 3 * step / 2);
        });
    };

});