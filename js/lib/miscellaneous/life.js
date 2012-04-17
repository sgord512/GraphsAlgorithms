define(["deps/under", "lib/utilities"], function(underscore, utilities) {

    var _ = underscore._;
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
        this.cells = utilities.generate_table(this.y,this.x,0);
        this.initialize(config.initial_state || []);
    }

    Life.prototype.initialize = function(init) {
        var self = this;
        _.each(init, function(point) { 
            var y = point[0];
            var x = point[1];
            self.cells[y][x] = 1;
        });
    }


    Life.prototype.query = function(y,x) {
        if(this.mode === 'bounded') {
            if(x < 0 || x >= this.x || y < 0 || y >= this.y) { return undefined; }
            else return this.cells[y][x];
        } else if(this.mode === 'toroidal') {
            var adjusted_x = (x < 0) ? (x + Math.ceil(Math.abs(x / this.x))) % this.x : x % this.x;
            var adjusted_y = (y < 0) ? (y + Math.ceil(Math.abs(y / this.y))) % this.y : y % this.y;
            return this.cells[adjusted_y][adjusted_x];
        } else { return false; }

    }

    Life.prototype.neighbors = function(y,x) {
        var list = [];
        list.push(this.query(y-1,x-1));
        list.push(this.query(y-1,x));
        list.push(this.query(y-1,x+1));
        list.push(this.query(y,x-1));
        list.push(this.query(y,x+1));
        list.push(this.query(y+1,x-1));
        list.push(this.query(y+1,x));
        list.push(this.query(y+1,x+1));
        return _.reject(list, _.isUndefined);

    }

    var alive = function(curr) { return curr === 1; }
    var dead = function(curr) { return curr === 0; }

    Life.prototype.next_state = function(curr, neighbors) {
        var living_neighbors = _.filter(neighbors, alive);
        if(alive(curr)) {
            if(living_neighbors.length === 2 || living_neighbors.length === 3) { return 1; }
        } else {
            if(living_neighbors.length === 3) { return 1; }
        }
        return 0;
    }


    Life.prototype.next_generation = function() {
        var next_generation = []
        for(var i = 0; i < this.y; i++) {
            next_generation[i] = []
            for(var j = 0; j < this.x; j++) {
                var cell = this.cells[i][j];
                next_generation[i][j] = this.next_state(cell,this.neighbors(i,j))
//                console.log("y: " + i + ", x: " + j + " | " + cell + " -> " + next_generation[i][j]);

            }
        }

        return next_generation;
    }

    Life.prototype.board = function() {
        return _.map(this.cells, function(d,i) { 
            return _.map(d, function(c,j) {
                return { x: j, y: i, cell: c };
            });
        });        
    }

    Life.prototype.update = function() {
        this.cells = this.next_generation();
        return this.board();
    }

    return Life;

});