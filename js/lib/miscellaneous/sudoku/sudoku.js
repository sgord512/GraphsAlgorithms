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
define(['deps/under', 'lib/utilities', 'lib/miscellaneous/sudoku/helper'], function(underscore, utilities, sh) {

    var _ = underscore._;

    var n = 3;
    var num = 9;
    var nums = function() { return _.range(1, 10); }

    var placeholder_code = "\u2B1C";

    var Region = function(squares, kind, number) {
        this.kind = kind;
        this.number_of_kind = number;
        this.squares = squares;
    }

    Region.prototype.solvable_pairs = function() {
        var sqs = this.squares;
        var solvable_numbers = filterProp(nums_w_poss_squares(sqs), 'squares', lone_elem);
        return _.map(solvable_numbers, function(v) { return { square: _.first(v.squares), number: v.number }; });
    }
    
    var filterProp = function(arr, prop, predicate) { return _.filter(arr, function(x) { return predicate(x[prop]); }); };
    var nums_w_poss_squares = function(sqs) { return assoc_result(unmatched_numbers(sqs), 'number', 'squares', function(x) { return _.filter(sqs, num_possibility(x)); }); }
    var empty = function(arr) { return arr.length === 0; }
    var lone_elem = function(arr) { return arr.length === 1; }
    var num_possibility = function(num) { return function(square) { return _.include(square.possibilities(), num); }; }
    var assoc_result = function(keyOrig, keyComp, f, arr) { return _.map(arr, function(x) { return { keyOrig: x, keyComp: f(x) }; }); }
    var unfilled_squares = function(squares) { return _.filter(squares, unfilled); }
    var filled_squares = function(squares) { return _.filter(squares, filled); }
    var value = function(square) { return square.value; }
    var unmatched_numbers = function(squares) { return _.difference(nums(), _.map(filled_squares(squares), value)); }
    var matched_numbers = function(squares) { return _.map(filled_squares(squares), value); }
    var unfillable = function(square) { return square.possibilities().length === 0; }
    var filled = function(square) { return !_.isUndefined(square.value); }
    var unfilled = function(square) { return _.isUndefined(square.value); }

    Region.prototype.unmatchable_numbers = function() {
        var sqs = this.squares;
        return filterProp(nums_w_poss_squares(sqs),  'squares', empty);
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
        this.regions = {};
        this.loc = { y: y, x: x };
    }

    Square.prototype.in_region_with_problems = function() {
        return _.any(this.regions, function(region) {
            return region.unmatchable_numbers().length > 0;
        });
    }

    Square.prototype.fill = function(v) { this.value = v; }
    Square.prototype.toLocString = function() { return "(" + this.loc.y + "," + this.loc.x + ")"; }
    Square.prototype.toString = function() { return this.toLocString() + ": " + (this.value || placeholder_code); }

    var Sudoku = function() {
        var board = _.map(nums(), function(i) { 
            return _.map(nums(), function(j) { 
                return new Square(i, j);
            });
        });

        var boxes = _.map(sh.boardBoxes(board), fromRegionData);
        var cols = _.map(sh.boardCols(board), fromRegionData);
        var rows = _.map(sh.boardRows(board), fromRegionData);
        
        var all_squares = _.flatten(board.slice());

        _.each(all_squares, function(square) { 
            square.regions['row'] = rows[square.loc.y - 1];
            square.regions['col'] = cols[square.loc.x - 1];
            square.regions['box'] = boxes[Math.floor((square.loc.y - 1) / 3) * 3 + Math.floor((square.loc.x - 1) / 3)]
        });

        this.board = board;
        this.all_squares = all_squares;
        this.history = [];
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

    Sudoku.prototype.randomly_fill_square = function() {
        var square = utilities.random_element(_.filter(this.all_squares, unfilled));
        var value = utilities.random_element(square.possibilities());
        console.log("Randomly filling a square\n");
        square.fill(value);
        this.history.push(square);
        return square;
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

    Sudoku.prototype.problems = function(queue) {
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
        var problems = this.problems(queue);
        while(queue && problems.length === 0) {
            queue = this.fill_next_square(queue);
            problems = this.problems(queue)
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

    Sudoku.prototype.print = function() {
        console.log(this.toString());
    }

    return Sudoku;

});
