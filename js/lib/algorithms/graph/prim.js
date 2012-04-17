define(['deps/under', 'lib/algorithms/graph/random_graph'], function(underscore, Graph) {

    var _ = underscore._;
    var Prim = {};

    Graph.prototype.algorithms.prim = Prim;
    
    Prim.initialize = function(graph) { 
        var p = {};
        
        p.display_name = "Prim's Algorithm";

        graph.addToMST(graph.vertices[Math.floor(Math.random() * graph.num_vertices)]);
                
        p.find_next_edge = function() {
            var next_edge, added_point;
            var current_index = 0;
            var edge_found = false;
            if(graph.vertices_in_tree.length == graph.num_vertices) return false ;
            while(current_index < graph.sorted_edge_list.length) {
                next_edge = graph.sorted_edge_list[current_index];
                if (p.valid_edge(next_edge)) {
                    graph.addToMST(next_edge);
                    graph.sorted_edge_list[current_index] = undefined;
                    graph.sorted_edge_list = _.compact(graph.sorted_edge_list);
                    edge_found = true;
                    break;
                }
                else { 
                    current_index += 1;
                }
            }

            if(!edge_found) { 
                console.log("out of luck"); return false;
            }
            if(p.incident_to_start(next_edge)) {
                added_point = next_edge.end_point();
            } else if(p.incident_to_end(next_edge)) {
                added_point = next_edge.start_point();
            }
            else console.log("This shouldn't happen");

            graph.addToMST(added_point);

            return true;
        }

        p.valid_edge = function(e) {
            var contains_start = p.incident_to_start(e);
            var contains_end = p.incident_to_end(e);
            return (contains_start && !contains_end) || (!contains_start && contains_end);
        }

        p.incident_to_start = function(e) {
            return _.include(graph.vertices_in_tree, e.start_point());
        }

        p.incident_to_end = function(e) {
            return _.include(graph.vertices_in_tree, e.end_point());
        }

        return p;
    };
    return Prim;
});