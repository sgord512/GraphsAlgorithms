define(["lib/utilities", "lib/algorithms/graph/ford_fulkerson"], function(utilities, Graph) {
    
var graph = Graph.create([[0, "Vancouver"],
                          [1, "Edmonton"],
                          [2, "Calgary"],
                          [3, "Saskatoon"],
                          [4, "Regina"],
                          [5, "Winnipeg"]],
                         [[0,1,16],
                          [0,2,13],
                          [2,1,4],
                          [1,3,12],
                          [3,2,9],
                          [2,4,14],
                          [4,3,7],
                          [3,5,20],
                          [4,5,4]]);

    graph.ford_fulkerson();

});