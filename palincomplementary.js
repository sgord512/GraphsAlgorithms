var u = require('underscore');

var Problem = function(string) {
    this.string = string;
}

Problem.prototype.lps = function() {
    this.build_table(); 
    return this.table[this.string.length][0];
}

var comp = function(c) {
    if(c === 'a') {
        return 't';
    } else if(c === 't') {
        return 'a';
    } else if(c === 'g') {
        return 'c';
    } else if(c === 'c') {
        return 'g';
    } else throw new Error("Invalid character provided: " + c + "!!");
}

var are_comp = function(a,b) {
    return a === comp(b);
}

var amt_to_add = function(a,b) {
    return are_comp(a,b) ? 2 : 0;
}

Problem.prototype.build_table = function() {
    this.table = [];
    for(var length = 0; length <= this.string.length; length++) {
        this.table[length] = [];
        console.log("l: " + length);
        for(var start_ix = 0; start_ix + length <= this.string.length; start_ix++) {
            if(length === 0) { 
                this.table[length][start_ix] = 0; 
            } else if(length === 1) {
                this.table[length][start_ix] = 0;
            } else if(length === 2) { 
                var match = are_comp(this.string[start_ix], this.string[start_ix + 1]);
                this.table[length][start_ix] = match ? 2 : 0;
            } else {
                var match = are_comp(this.string[start_ix], this.string[start_ix + length - 1]);
                console.log("s: " + start_ix);
                console.log("testing " + this.string[start_ix] + ", " + this.string[start_ix + length -1] + " | " + match);                
                var lps_for_middle = this.table[length - 2][start_ix + 1];
                console.log("adding to lps for: " + this.string.slice(start_ix + 1, start_ix + length - 1) + ", " + lps_for_middle);
                var lps_for_ends = lps_for_middle + (match ? 2 : 0);
                console.log("lps for ends: " + lps_for_ends);
                var possibilities = [lps_for_ends, this.table[length - 1][start_ix]];
                if(start_ix !== length - 1) { possibilities.push(this.table[length - 1][start_ix + 1]); }
                console.log(possibilities);
                var max = u.max(possibilities);
                this.table[length][start_ix] = max;
            }
        }
    }
}

var a = new Problem("a");
var b = new Problem("ac");
var c = new Problem("at");
var d = new Problem("agcagttgc");
var e = new Problem("acgagtgatatggc");
var f = new Problem("acgtcggatataggt");
var g = new Problem("acgtcagatatagcg");
var h = new Problem("aacgtgtcaaaatcga");