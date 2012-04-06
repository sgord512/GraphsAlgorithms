define(['deps/under', 'lib/data_structures/graphs'], function(underscore, Graph) {
    

    var _ = underscore._;
    var Kruskal = {};

    Graph.prototype.algorithms.kruskal = Kruskal;

    Kruskal.initialize = function(graph) {
        var k = {};

        k.display_name = "Kruskal's Algorithm";

        k.forests = [];

        k.Forest = function(index, vertices) {
            this.index = index;
            this.vertices = vertices;
        }

        k.Forest.prototype.add_vertices = function(vertices) {
            var self = this;
            _.each(vertices, function(v) {
                v.forest = self.index;
            });
            this.vertices = this.vertices.concat(vertices);
        }
      

        _.each(graph.vertices, function(v) {
            k.forests.push(new k.Forest(v.index, [v]));
            graph.addToMST(v);
            v.forest = v.index;
        });
        
        k.find_next_edge = function() {
            var next_edge;
            var edge_found = false;
            if(k.forests.length == 1) return false;
            while(!edge_found) {
                next_edge = graph.sorted_edge_list.shift();
                if (k.connects_two_forests(next_edge)) {
                    graph.addToMST(next_edge);
                    k.merge_forests(k.first_forest_index(next_edge), k.second_forest_index(next_edge));
                    edge_found = true;
                }
            }
            return true;
        }

        k.merge_forests = function(index1, index2) {
            var second_forest = k.find_forest_by_index(index2);
            var first_forest = k.find_forest_by_index(index1);
            first_forest.add_vertices(second_forest.vertices);
            k.forests[k.find_forest_index(index2)] = undefined;
            k.forests = _.compact(k.forests);
        }

        k.find_forest_by_index = function(i) {
            var current_index = 0;
            while(current_index < k.forests.length) {
                var current_forest = k.forests[current_index];
                if(current_forest.index > i) {
                    return undefined;
                }
                else if(current_forest.index === i) {
                    return current_forest;
                }
                else {
                    current_index = current_index + 1;
                }
            }
            return undefined;
        }
        k.find_forest_index = function(i) {
            var current_index = 0;
            while(current_index < k.forests.length) {
                var current_forest = k.forests[current_index];
                if(current_forest.index > i) {
                    return undefined;
                }
                else if(current_forest.index === i) {
                    return current_index;
                }
                else {
                    current_index = current_index + 1;
                }
            }
            return undefined;
        }


        k.connects_two_forests = function(e) { 
            var result = e.start_point.forest !== e.end_point.forest;
            return result;
        }

        k.first_forest_index = function(e) {
            return _.min([e.start_point.forest, e.end_point.forest]);
        }

        k.second_forest_index = function(e) {
            return _.max([e.start_point.forest, e.end_point.forest]);
        }

        return k;
    }
    return Kruskal;


});
      