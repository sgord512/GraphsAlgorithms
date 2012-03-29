var generate_table = function(x, y, entry) {
    var t = [];
    for(var i = 0; i < x; i++) {
        t[i] = [];
        for(var j = 0; j < y; j++) {
            t[i][j] = entry;
        }
    }
    return t;
}
