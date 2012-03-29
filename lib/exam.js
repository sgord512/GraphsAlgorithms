var Problem = function(n, k, problems) {
    this.n = n;
    this.k = k;
    this.problems = problems;

}

var a = new Problem(3,3,[0.4,0.6,0.5]);
var b = new Problem(4,0,[0.4,0.6,0.5,0.25]);
var c = new Problem(4,1,[0.4,0.6,0.5,0.25]);

Problem.prototype.build_table = function() {

    var table = []
    
    for(var k = 0; k <= this.k; k++) {

        table[k] = [];

        for(var start_ix = this.n - k; start_ix >= 0; start_ix--) {
                
            if(k === 0) { 
                
                if(start_ix === this.n ) {
                    
                    table[k][start_ix] = 1;

                } else {

                    table[k][start_ix] =  (1 - this.problems[start_ix]) * table[k][start_ix + 1];
                }
                    
            } else {
                var k_made_with_ix_correct = table[k - 1][start_ix + 1] * this.problems[start_ix];

                if(start_ix === this.n - k) { 

                    var k_made_with_ix_wrong = 0; 

                } else {

                    var k_made_with_ix_wrong = table[k][start_ix + 1] * (1 - this.problems[start_ix])
                }

                table[k][start_ix] = k_made_with_ix_correct + k_made_with_ix_wrong;

                
            }
        }
    }

    this.table = table;
    return this.table;
            
}

Problem.prototype.exactly_k = function() {
    this.build_table();
    return this.table[this.k][0];
}