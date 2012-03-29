// Rules
// Live cell with fewer than two live neighbors dies
// Live cell with two or three neighbors lives
// Live cell with more than three neighbors dies
// Dead cell with exactly three living neighbors lives
var Life = {}

Life = function(config) {
    this.x = config.x || 100;
    this.y = config.y || 100;
    this.mode = config.mode || 'bounded';
    this.grid = 
}

var query = function(x,y) {

    return false;

}

var neighbors = function(x,y) {

    return false;

}

var update = function(current_state) {

    return current_state;
}

