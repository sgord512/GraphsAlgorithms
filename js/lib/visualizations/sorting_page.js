define(["deps/under", "deps/d3", "lib/algorithms/sorting/quicksort", "lib/algorithms/sorting/selection", "lib/algorithms/sorting/insertion"], function(underscore, quicksort, selection_sort, insertion_sort) {

    var _ = underscore._;

    return function() {
        
        var h = screen.availHeight - 50;
        var w = screen.availWidth - 50;

        var canvas = d3.select("#sketchpad")
            .append("svg:canvas")
            .attr("width"
            










    }

});