var requirejs = require('requirejs');
var should = require('should');
requirejs.config({
    baseUrl: 'js',
    nodeRequire: require
});

describe("Ford-Fulkerson", function() {
    var Graph = requirejs('lib/algorithms/graph/ford_fulkerson');
    var graph = Graph.create([[0, "Vancouver"],
                              [1, "Edmonton"],
                              [2, "Calgary"],
                              [3, "Saskatoon"],
                              [4, "Regina"],
                              [5, "Winnipeg"]],
                             [[0,1,16],
                              [0,2,13],
                              [2,1,4],
                              [1,3,12],
                              [3,2,9],
                              [2,4,14],
                              [4,3,7],
                              [3,5,20],
                              [4,5,4]],
                             0,
                             5);   
 
    it("Should return the max-flow for a graph", function() {
        (graph.ford_fulkerson().max_flow()).should.equal(23);
    });

});

describe("Majority-Element", function() {
    var me = requirejs('lib/algorithms/divide_and_conquer/majority_element');
    var examples = { first: ['X','X','X','X','X','Y'],
                     second: ['X','Y','X','Y','X','Y'],
                     third: ['X','Y','X','Y','Y'],
                     fourth: ['Y','Y','X']
                   }
    
    it("Should return the majority element when it exists", function() {
        me.majority_element(examples.first).should.equal('X');
        me.majority_element(examples.third).should.equal('Y');        
        me.majority_element(examples.fourth).should.equal('Y');
    });

    it("Should return nothing when there is no majority element", function() {
        should.not.exist(me.majority_element(examples.second));
    });
        
});

describe("Splay Tree", function() {
    var SplayTree = requirejs('lib/data_structures/splay_tree');
    var st = new SplayTree();
    st.insert(1).insert(3).insert(2);
    
    it("Should have the most recently inserted value as the root", function() {
        ((new SplayTree()).insert(1).insert(3).insert(2).root.value).should.equal(2);
    });

    it("Should contain all the inserted elements", function() {
        st.search(1).should.be.ok;
        st.search(2).should.be.ok;
        st.search(3).should.be.ok;
    });
    
    it("Should not contain any other elements", function() {
        should.not.exist(st.search(4));
        should.not.exist(st.search(5));
    });

});

describe("Towers of Hanoi Solver", function() {
    var lib = requirejs('lib/miscellaneous/hanoi');

    it("Should solve the towers of Hanoi puzzle in the minimum number of moves", function() {
        (lib.moves(3)).should.equal(7);
        (lib.step_moves(3)).should.equal(26);
    });

});

describe("Matrix Multiplication Verifier", function() {
    var lib = requirejs('lib/miscellaneous/matrix_multiplication_verifier');

    it("Should correctly determine that AB does not equal CD", function() {
        lib.monte_carlo_verify(lib.A, lib.B, lib.C, lib.D).should.not.be.ok;
        lib.monte_carlo_verify(lib.E, lib.F, lib.G, lib.H).should.be.ok;
    });

});

describe("Queue", function() {
    var lib = requirejs('lib/data_structures/queue');
    
    var a = new lib();
    
    a.enqueue(4).enqueue(5).enqueue(6);

    it("Should correctly be FIFO", function() {
        a.dequeue().should.equal(4);
        a.dequeue().should.equal(5);
        a.dequeue().should.equal(6);
        should.not.exist(a.dequeue());
    });
});
        
describe("Quicksort", function() { 
    var lib = requirejs('lib/algorithms/sorting/sorts')();
    
    var a = [1,3,2,4,5];
    var b = [2,4,3,1,5];
    var c = [5,4,2,1,3];
    var d = [1,2,3,4,5];

    it("Should sort the provided inputs", function() {
        lib.quicksort(a).should.eql(d);
        lib.quicksort(b).should.eql(d);
        lib.quicksort(c).should.eql(d);
    });

});
    