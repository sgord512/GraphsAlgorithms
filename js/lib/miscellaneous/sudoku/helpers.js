define(['deps/under', 'lib/utilities'], function(underscore, utilities) {

    var _ = underscore._;

    var n = 3; 
    var num = 9;

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

    var boardBoxes = function(board) {
        var boxes = [];
        for(var i = 0; i < n; i++) {
            for(var j = 0; j < n; j++) {
                var squares = _.flatten(_.map(_.range(0, n), function(y) {
                    return _.map(_.range(0, n), function(x) {
                        return board[i * n + y][j * n + x];
                    });
                }));
                boxes.push(toRegionData(squares, 'box', i * 3 + j + 1));
            }
        }
        return boxes;
    }

    var boardCols = function(board) {
        var cols = _.map(_.range(1, num + 1), function(x) { 
            var squares = getCol(board, x);
            return toRegionData(squares, 'col', x);
        });
        return cols;
    }

    var boardRows = function(board) {
        var rows = _.map(_.range(1, num + 1), function(y) { 
            var squares = getRow(board, y);
            return toRegionData(squares, 'row', y);
        });
        return rows;
    }

    var toRegionData = function(squares, kind, number_of_kind) {
        return { squares: squares, kind: kind, number_of_kind: number_of_kind };
    }

    var fromRegionData = function(rd) {
        return new Region(rd.squares, rd.kind, rd.number_of_kind };
    }
    
    return {
        getRow: getRow,
        getCol: getCol,
        getBox: getBox,
        boardBoxes: boardBoxes,
        boardCols: boardCols,
        boardRows: boardRows,
        num: num,
        n: n,
        toRegionData: toRegionData,
        fromRegionData: fromRegionData
    }

});