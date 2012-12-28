define(["deps/d3-v3/d3", "deps/d3-v3/lib/colorbrewer/colorbrewer"], function(d, colorbrewer) {
    var d3 = this.d3;
    d3.colorbrewer = colorbrewer;
    return d3;
});