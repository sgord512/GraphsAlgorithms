/* Thoughts on designing a sudoku generator and solver. 

1. There are two types of constraints at play in a game: 
Negative constraints come from numbers already in the regions that a square is part of.

So if a box contains a 6, all the other squares in that box cannot contain a 6.
        row                                             row
        col                                             col

Positive constraints come from all the numbers having to be in a certain region.

They are assertions of the form: A 5 must appear in one of the following 3 cells: blah, blah, ...

The way they work is each number must be present in one square in each region. 
So what we need to check is: forall x in set, which cells can contain x?

I think that, unlike negative constraints, they don't really accumulate in any meaningful sense.
They are used, at least on a first pass, to fill a cell or not. That is all. 
Initially I will have them recomputed every time new data is accumulated.

*/
define(['deps/under', 'lib/utilities'], function(underscore, utilities) {

    var _ = underscore._;

    var n = 3;
    var num = 9;

    var placeholder_code = "\u2B1C";

    var Region = function(squares, kind, number) {
        this.kind = kind;
        this.number_of_kind = number;
        this.unmatched_numbers = _.range(1, num + 1);
        this.matched_numbers = [];
        this.unfilled_squares = squares;
        this.filled_squares = [];
    }

    Region.prototype.update = function(square) {        
        var value = square.value;
        this.filled_squares.push(square);
        this.unfilled_squares = _.without(this.unfilled_squares, square);
        this.matched_numbers.push(value);
        this.unmatched_numbers = _.without(this.unmatched_numbers, value);
        _.each(this.unfilled_squares, function(square) { 
            square.possibilities = _.without(square.possibilities, value);
        });
    }

    Region.prototype.squares_for_num = function(i) {
        return _.filter(this.unfilled_squares, function(square) {
            return _.include(square.possibilities, i);
        });
    }

    Region.prototype.solvable_pairs = function() {
        var self = this;
        var squares_for_numbers = _.map(this.unmatched_numbers, function(i) {
            return { number: i, squares: self.squares_for_num(i) };
        });
        var solvable_numbers = _.filter(squares_for_numbers, function(v) { return v.squares.length === 1; });

        return _.map(solvable_numbers, function(v, k) {
            return { square: _.first(v.squares), number: v.number };
        });
    }

    Region.prototype.unmatchable_numbers = function() {
        var self = this;
        return _.filter(this.unmatched_numbers, function(i) {
            return self.squares_for_num(i).length === 0; 
        });
    }

    Region.prototype.toString = function() {
        var str = "";
        if(this.kind === 'col') {
            str += "Column";
        } else if(this.kind === 'row') {
            str += "Row";
        } else if(this.kind === 'box') {
            str += "Box";
        }
        str += " " + this.number_of_kind;
        return str;
    }

    var Square = function(y, x) {
        this.value = undefined;
        this.possibilities = _.range(1, num + 1);
        this.regions = {};
        this.loc = { y: y, x: x };
    }

    Square.prototype.unfillable = function() { 
        return !this.value && this.possibilities.length === 0;
    }

    Square.prototype.in_region_with_problems = function() {
        return _.any(this.regions, function(region) {
            return region.unmatchable_numbers().length > 0;
        });
    }

    Square.prototype.fill = function(v) { 
        this.value = v;
        console.log(this.toString() + "\n");
    }

    Square.prototype.toLocString = function() {
        return "(" + this.loc.y + "," + this.loc.x + ")"
    }

    Square.prototype.toString = function() { 
        return this.toLocString() + ": " + (this.value || placeholder_code);
    }

    var Sudoku = function() {
        var board = _.map(_.range(0, num), function(i) { 
            return _.map(_.range(0, num), function(j) { 
                return new Square(i + 1, j + 1);
            });
        });
        
        var all_squares = _.flatten(board.slice());

        var boxes = [];
        for(var i = 0; i < n; i++) {
            for(var j = 0; j < n; j++) {
                var squares = _.flatten(_.map(_.range(0, n), function(y) {
                    return _.map(_.range(0, n), function(x) {
                        return board[i * n + y][j * n + x];
                    });
                }));
                boxes.push(new Region(squares, 'box', i * 3 + j + 1));
            }
        }

        var cols = _.map(_.range(1, num + 1), function(x) { 
            var squares = getCol(board, x);
            return new Region(squares, 'col', x);
        });

        var rows = _.map(_.range(1, num + 1), function(y) { 
            var squares = getRow(board, y);
            return new Region(squares, 'row', y);
        });
                                
        _.each(all_squares, function(square) { 
            square.regions['row'] = rows[square.loc.y - 1];
            square.regions['col'] = cols[square.loc.x - 1];
            square.regions['box'] = boxes[Math.floor((square.loc.y - 1) / 3) * 3 + Math.floor((square.loc.x - 1) / 3)]
        });

        this.board = board;
        this.unfilled_squares = all_squares;
        this.filled_squares = [];
        this.solvable_pairs = [];
        this.last_filled_square = undefined;
        this.regions = boxes.concat(cols, rows);
    }

    Sudoku.prototype.toString = function() { 
        var str = "";
        for(var i = 0; i < this.board.length; i++) {
            var row = this.board[i];
            if(i && i % 3 === 0) { str += utilities.pad_front_to_length("", 24, '-') + "\n"; }
            str += " ";
            for(var j = 0; j < row.length; j++) {
                var square = row[j];
                if(j && j % 3 === 0) { str += "| " };
                if(square.value) { 
                    if(this.last_filled_square === square) { 
                        str += "\033[32m" + square.value + "\033[37m";
                    } else {
                        str += square.value;
                    }
                } else {
                    var unfillable = square.unfillable();
                    var problematic = square.in_region_with_problems();
                    if(unfillable && problematic) {
                        str += "\033[35m" + placeholder_code + "\033[37m";
                    } else if(unfillable) { 
                        str += "\033[31m" + placeholder_code + "\033[37m";
                    } else if(problematic) {
                        str += "\033[34m" + placeholder_code + "\033[37m";
                    } else {
                        str += placeholder_code;
                    }
                }
                str += " ";
            }
            str += "\n";
        }
        return str;
    }

    Sudoku.prototype.update_regions_for_square = function(square) {
        _.each(square.regions, function(v) { 
            v.update(square);
        });
    }
        
    Sudoku.prototype.randomly_fill_square = function() {
        var square = utilities.random_element(this.unfilled_squares);
        var value = utilities.random_element(square.possibilities);
        console.log("Randomly filling a square\n");
        square.fill(value);
        return square;
    }    

    Sudoku.prototype.mark_square_as_filled = function(square) {
        this.unfilled_squares = _.without(this.unfilled_squares, square);
        this.filled_squares.push(square);
    }

    Sudoku.prototype.fill_next_square = function(queue) {
        var square;
        if(queue.length > 0) {
            var pair = queue.shift();
            console.log("Solvable squares in queue: " + this.queue_string(queue) + "\n");
            square = pair.square;
            square.fill(pair.number);
        } else if(this.unfilled_squares.length > 0) {
            square = this.randomly_fill_square();
            if(!square.value) { return false; }
        } else return false;
                   
        this.mark_square_as_filled(square);
        this.last_filled_square = square;
        this.update_regions_for_square(square);
        
        var solvable_queue = _.reduce(this.regions, function(queue, region) { 
            return queue.concat(region.solvable_pairs());
        }, []);

        return solvable_queue;
    }

    Sudoku.prototype.queue_string = function(queue) { 
        var solvable_square_lists = _.groupBy(queue, function(p) { return p.square; });

        var solvable_squares_with_all_values = _.map(solvable_square_lists, function(list) { 
            return { square: list[0].square, numbers: _.uniq(_.map(list, function(p) { return p.number; }))
                   }
        });
        var solutions_string = _.map(solvable_squares_with_all_values, function(p) { return p.square.toLocString() + "=[" + p.numbers.toString() + "]"; }).join("; ");
        return solutions_string;
    }

    Sudoku.prototype.problems = function() {
        var unfillable_squares = _.filter(this.unfilled_squares, function(square) {
            return square.unfillable();
        });

        var regions_and_unmatchable_numbers = _.map(this.regions, function(r) {
            return { region: r, unmatchable_numbers: r.unmatchable_numbers() };
        });
        var problem_regions = _.filter(regions_and_unmatchable_numbers, function(pair) {
            return pair.unmatchable_numbers.length > 0; 
        });
        return unfillable_squares.concat(problem_regions);
    }

    Sudoku.prototype.fill_board = function() {
        var queue = this.fill_next_square([]);
        var problems = this.problems();
        while(queue && problems.length === 0) {
            queue = this.fill_next_square(queue);
            problems = this.problems()
            this.print();
        }
        if(this.unfilled_squares.length > 0) {
            console.log("The following problems have been found: ");
            console.log(this.problems_string(problems));
        }
    }

    Sudoku.prototype.problems_string = function(problems) {
        return _.map(problems, function(problem) { 
            if(problem instanceof Square) {
                return "Square \033[31m" + problem.toLocString() + "\033[37m is unfillable";
            } else {
                return "Region \033[34m" + problem.region.toString() + "\033[37m can't match the following numbers: " + problem.unmatchable_numbers.join(", ");
            }
        }).join("\n");
    }

    Sudoku.prototype.getSquare = function(y, x) { 
        return this.board[y - 1][x - 1];
    }

    Sudoku.prototype.getNumberInBox = function(y, x) { 
        var r = y % 3;
        var c = x % 3;
        return r * 3 + c + 1;
    }

    Sudoku.prototype.getRow = function(y) { return getRow(this.board, y); }

    Sudoku.prototype.getCol = function(x) { return getCol(this.board, x); }

    Sudoku.prototype.getBox = function(y, x) { return getBox(this.board, y, x); }
    
    var getRow = function(board, y) { 
        return board[y - 1].slice();
    }

    var getCol = function(board, x) { 
        return _.map(board, function(row) { return row[x - 1]; });
    }

    var getBox = function(board, y, x) {
        var i = Math.floor((y - 1) / 3);
        var j = Math.floor((x - 1) / 3);
        var arr = new Array(num);
        for(var row = i * 3; row < (i + 1) * 3; row++) {
            for(var col = j * 3; col < (j + 1) * 3; col++) {
                arr[(row % 3) * 3 + (col % 3)] = board[row][col]; 
            }
        }
        return arr;
    }

    Sudoku.prototype.print = function() {
        console.log(this.toString());
    }

    return Sudoku;

});
