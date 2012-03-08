define(['underscore-1.3.1', 'jquery-1.7.1', 'd3/d3'], function(underscore, $, d3) {

    var _ = this._;
    var $ = this.$;
    var d3 = this.d3;

    return function() { 

        $(document).ready(function() {
            
            var h = 7/8 * screen.height;
            var w = screen.width;

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


            function Leaf(frequency, letter) {
                this.freq = frequency;
                this.letter = letter;
                this.height = 0;
            }

            Leaf.prototype.toString = function() {
                return this.letter + ": " + this.freq + "%";
            }

            function Node(left, right) {
                this.freq = left.freq + right.freq;
                this.left = left;
                this.left.parent = this;
                this.left.side = 'left';
                this.right = right;
                this.right.parent = this;
                this.left.side = 'right';
                this.height = _.max[right.height, left.height];
            }

            function huffman_init(frequencies) {
                var nodes = [];
                _.each(frequencies, function(freq, letter) {
                    nodes.push(new Leaf(freq, letter));
                });
                return nodes;
            }

            function huffman_update(nodes)
            {
                nodes = _.sortBy(nodes, function(node) { return node.freq; });
                while(nodes.length > 1) {
                    var left = nodes.shift();
                    var right = nodes.shift();
                    nodes.push(new Node(left, right));
                    nodes = _.sortBy(nodes, function(node) { return node.freq; });
                }
                return nodes.pop();
            }

            function map(node, f_node) {
                if (node instanceof Node) {
                    f_node(node);
                    map(node.right, f_node);
                    map(node.left, f_node);
                }
            }

            function onLeaves(node, f) { 
                if(node instanceof Leaf) { f(node); }
                else {
                    onLeaves(node.right, f);
                    onLeaves(node.left, f);
                }
            }

            function encoding(node) {
                if(!_.isUndefined(this.encoding)) { 
                    return this.encoding;
                } else if(_.isUndefined(this.parent)) { 
                    this.encoding = '';
                    return ''; 
                }
                else if(this.side === 'left') {
                    this.encoding = encoding(this.parent) + '0';
                    return this.encoding;
                }
                else if(this.side === 'right') {
                    this.encoding = encoding(this.parent) + '1';
                    return this.encoding;
                }
                else { return false; }
            }

            function encodeChildren(node) { 
                var code = node.encoding || '';
                node.left.encoding = code + '0';
                node.right.encoding = code + '1';
            }

            var nodes = huffman_init(freqs.english);            

            var scale_x = d3.scale.ordinal()
                .domain(nodes)
                .rangePoints([0,w], 1.0);

            var scale_r = d3.scale.linear()
                .domain([_.min(_.pluck(nodes, 'freq')), _.max(_.pluck(nodes, 'freq'))])
                .range([10, w / nodes.length / 2]);

            var transform_string = function(x, y) {
                return "translate(" + x + "," + y + ") ";
            }

            var drawNode = function(empty) { 
                var group = empty.append("svg:g")                
                    .attr("transform", function(d) { return transform_string(scale_x(d), h/2) });
                group.append("svg:circle")
                    .attr("cx", 0)
                    .attr("cy", 0)
                    .attr("r", function(d) { return scale_r(d.freq) })
                    .style("fill", d3.rgb(255, 0, 0));
                group.append("svg:text")
                    .style("font-family", "sans-serif")
                    .style("text-anchor", "middle")
                    .style("alignment-baseline", "middle")
                    .style("fill", d3.hsl(0,0,1))
                    .attr("x", 0)
                    .attr("y", 0)
                    .text(function(d) { return d.letter });
            }

            var parts = canvas.selectAll("g")
                .data(nodes);

            drawNode(parts.enter());

            var sum = 0;
            var e_results = huffman_update(huffman_init(freqs.english));
            map(e_results, encodeChildren);
            onLeaves(e_results, function(n) { return sum += n.encoding.length * (n.freq / 100) })
            console.log(sum);
            sum = 0;
            var f_results = huffman_update(huffman_init(freqs.french));
            map(f_results, encodeChildren);
            onLeaves(f_results, function(n) { return sum += n.encoding.length * (n.freq / 100) })
            console.log(sum);
            var lol;
        });
    };

});