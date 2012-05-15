define(['lib/utilities', 'deps/under', 'lib/data_structures/stack'], function(utilities, underscore, Stack) {

    var _ = underscore._;

    var hanoi = utilities.memoize(function(n) {
        return (n === 0) ? 1 : 2*hanoi(n - 1) + 1;
    });

    var hanoi2 = utilities.memoize(function(n) {
        return (n === 0) ? 2 : 2*hanoi2(n - 1) + 2;
    });

    var setup_hanoi = function(n) {
        var a = new Stack();
        for(var i = 0; i < n; i++) {
            a.push(n - i);
        }
        return { a: a, mid: new Stack(), b: new Stack() };
    }


    var hanoi_solver = function() {

        var size = 5;


        var tower = setup_hanoi(5);

        var move_n_disks = function(from, to, n) {
            if
        }


    return {
        hanoi: hanoi,
        hanoi2: hanoi2
    }
        
});