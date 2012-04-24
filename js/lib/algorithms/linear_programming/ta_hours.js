define(["deps/under", "lib/utilities", "lib/algorithms/graph/ford_fulkerson"], function(underscore, utilities, Graph) {

    var _ = underscore._;
    
    var examples = { 
        first: { ta_list: [["A",[1,2,9,13,17,18,21,25]],
                           ["B",[2,4,6,7,12,15,16,18,25]],
                           ["C",[3,5,7,9,11,14,17,20,24]],
                           ["D",[3,6,9,11,13,15,17,18,22]],
                           ["E",[5,8,10,14,16,20,21,25]]],
                 
                 slots: 25,
                 
                 days: [[1,"Monday", 3],
                        [2,"Tuesday", 4],
                        [3,"Wednesday", 3],
                        [4,"Thursday", 2],
                        [5,"Friday", 1]],
                 
                 c: 13,
                 b: 3,
                 a: 1
               }
    }

    var as_flow_network = function(problem) {
        var nodes = [];
        var edges = [];
        _.each(problem.ta_list, function(ta, index) { 
            nodes.push([index, ta[0]]);
        });

        var slot_offset = nodes.length;

        _.each(_.range(0, problem.slots), function(slot) {
            nodes.push([slot + slot_offset, String(slot + 1)]); 
        });

        var day_of_slot = function(slot) { return Math.ceil(slot / problem.days.length); }
            
        var slot_index = function(slot) { return slot_offset - 1 + slot; }
        
        var day_offset = nodes.length;
        
        var day_index = function(day) { return day_offset - 1 + day; }

        _.each(problem.days, function(day) {
            nodes.push([nodes.length, day[0]]);
        });

        var min_hours = nodes.length;
        nodes.push([nodes.length, "min_hours"]);
        var excess_hours = nodes.length;
        nodes.push([nodes.length, "excess_hours"]);
        var min_hours_per_day = nodes.length;
        nodes.push([nodes.length, "min_hours_per_day"]);
        var excess_hours_per_day = nodes.length;
        nodes.push([nodes.length, "excess_hours_per_day"]);
        var source = nodes.length;
        nodes.push([nodes.length, "source"]);
        var sink = nodes.length;
        nodes.push([nodes.length, "sink"]);
        
        var total_hours_from_min_days = _.reduce(problem.days, function(sum, day) { return day[2] + sum; }, 0);
        edges.push([source, min_hours_per_day, total_hours_from_min_days]);
        edges.push([source, excess_hours_per_day, problem.c - total_hours_from_min_days]);
        edges.push([min_hours, sink, problem.a * problem.ta_list.length]);
        edges.push([excess_hours, sink, problem.c - problem.a * problem.ta_list.length]);

        _.each(problem.ta_list, function(ta, ta_index) { 
            edges.push([ta_index, min_hours, problem.a]); 
            edges.push([ta_index, excess_hours, problem.b - problem.a]);
        });

        _.each(_.range(1, problem.slots + 1), function(slot) {
            edges.push([day_index(day_of_slot(slot)), slot_index(slot), 1]);
        });

        _.each(problem.days, function(day) {
            edges.push([min_hours_per_day, day_index(day[0]), day[2]]);
            edges.push([excess_hours_per_day, day_index(day[0]), problem.c - day[2]]);
        });

        _.each(problem.ta_list, function(ta, ta_index) {
            _.each(ta[1], function(slot) { 
                edges.push([slot_index(slot),ta_index,1]);
            });
        });

        return Graph.create(nodes, edges, source, sink);
    }
    
    return {
        as_flow_network: as_flow_network,
        examples: examples
    };

});