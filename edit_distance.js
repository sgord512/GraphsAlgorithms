var u = require('underscore');

print_edit_table = function(word1, word2) { 
    var word1 = " " + word1;
    var word2 = " " + word2
    var table = [];

    u.each(u.range(0, word1.length), function(n) {
        table[n] = new Array(word2.length);
    });

    for(var i = 0; i < table.length; i++) {
        table[i][0] = i;
    }

    for(var j = 1; j < table[0].length; j++) {
        table[0][j] = j;
    }

    for(var i = 1; i < table.length; i++) {
        for(var j = 1; j < table[i].length; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                table[i][j] = table[i - 1][j - 1];
            } else {
                table[i][j] = u.min([ table[i - 1][j], table[i][j - 1], table[i - 1][j - 1] ]) + 1;
            }
        }
    }
    for(var i = -1; i < table.length; i++) {
        if(i == -1) {
            var word_p = "  ";
            u.each(u.range(0, word2.length), function(n) { 
                word_p = word_p.concat(word2[n] + " ");
            });
            console.log(word_p);
        } else { 
            var row = table[i].slice(0);
            row.unshift(word1[i]);
            console.log(row.join(" ")); 
        }
    }
    return table;
}