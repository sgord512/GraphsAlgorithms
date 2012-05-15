define(["lib/utilities", "lib/algorithms/linear_programming/ta_hours"], function(utilities, ta_hours) {
    
    var result = ta_hours.as_flow_network(ta_hours.examples.first);
    result.ford_fulkerson();
    


}); 