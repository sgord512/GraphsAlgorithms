define(['deps/under', 'lib/utilities'], function(underscore, utilities) {

    var _ = underscore._;

    var generate_unique_id = utilities.id_generator();

    var Constraint = function(n) {
        this.value = n;
        this.id = generate_unique_id();
    }

    var Sudoku = function() {
        this.board = _.map(_.range(0, 9), function(i) { 
            return _.map(_.range(0, 9), function(j) { 
                var cell = { value: undefined, constraints: { row: new Array(9), col: new Array(9), box: new Array(9) }, loc: { y: i + 1, x: j + 1 } }
                cell.constraints.row[i] = "Me"; 
                cell.constraints.col[j] = "Me";
                cell.constraints.box[(i % 3) * 3 + (j % 3)] = "Me";
                return cell;
            }); 
        });
    }

    Sudoku.prototype.toString = function() { 
        var str = "";
        for(var i = 0; i < this.board.length; i++) {
            var row = this.board[i];

            if(i && i % 3 === 0) { str += utilities.pad_front_to_length("", 24, '-') + "\n"; }

            str += " ";

            for(var j = 0; j < row.length; j++) {
                var cell = row[j];

                if(j && j % 3 === 0) { str += "| " };

                str += (cell.value ? cell.value : "\u2022") + " ";
            }
            str += "\n";
        }
        return str;
    }

    Sudoku.prototype.setSquare = function(y, x, v) { 
        var col = _.reject(this.getCol(x), function(cell) { return cell.loc.y === y; });
        var row = _.reject(this.getRow(y), function(cell) { return cell.loc.x === x; });
        var box = _.reject(this.getBox(y, x), function(cell) { return cell.loc.x === x && cell.loc.y === y });
        var num_in_box = this.getNumberInBox(y, x);
        _.map(col, function(cell) { cell.constraints.col[y - 1] = new Constraint(v) });
        _.map(row, function(cell) { cell.constraints.row[x - 1] = new Constraint(v) });
        _.map(box, function(cell) { cell.constraints.box[num_in_box - 1] = new Constraint(v) });
        var cell = this.getCell(y, x);
        cell.value = v;
    }

    Sudoku.prototype.getCell = function(y, x) { 
        return this.board[y - 1][x - 1];
    }

    Sudoku.prototype.getNumberInBox = function(y, x) { 
        var r = y % 3;
        var c = x % 3;
        return r * 3 + c + 1;
    }

    Sudoku.prototype.getRow = function(y) { 
        return this.board[y - 1].slice();
    }

    Sudoku.prototype.getCol = function(x) { 
        return _.map(this.board, function(row) { return row[x - 1]; });
    }

    Sudoku.prototype.getBox = function(y, x) {
        var i = Math.floor(y / 3);
        var j = Math.floor(x / 3);
        var arr = new Array(9);
        for(var row = i * 3; row < (i + 1) * 3; row++) {
            for(var col = j * 3; col < (j + 1) * 3; col++) {
                arr[(row % 3) * 3 + (col % 3)] = this.board[row][col]; 
            }
        }
        return arr;
    }
        

    Sudoku.prototype.print = function() {
        console.log(this.toString());
    }

    return Sudoku;
    


});
