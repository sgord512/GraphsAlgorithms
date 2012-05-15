define(['lib/utilities', 'deps/under', 'lib/data_structures/stack'], function(utilities, underscore, Stack) {

    var _ = underscore._;

    var hanoi_num = utilities.memoize(function(n) {
        return (n === 1) ? 1 : 2*hanoi_num(n - 1) + 1;
    });

    var hanoi_step_num = utilities.memoize(function(n) {
        return (n === 1) ? 2 : 3*hanoi_step_num(n - 1) + 2;
    });

    var setup_hanoi = function(n) {
        var a = new Stack();
        for(var i = 0; i < n; i++) {
            a.push(n - i);
        }
        return { a: a, mid: new Stack(), b: new Stack(), steps: 0 };
    }

    var print_state = function(pegs) {
        console.log("a: " + pegs.a);
        console.log("mid: " + pegs.mid);
        console.log("b: " + pegs.b);
        console.log("---------------------");
    }

    var record_state = function(pegs) {
        return [{ name: 'a', value: pegs.a.contents() },
                { name: 'mid', value: pegs.mid.contents() },
                { name: 'b', value: pegs.b.contents() }];
    }
        
    var hanoi_solver = function(n, callback) {
        
        var history = [];

        var pegs = setup_hanoi(n);

        history.push(record_state(pegs));

        var move_n_disks = function(pegs, from, to, n) {
            var free_peg = _.first(_.difference(_.keys(pegs), [from, to]));
            if(n === 1) { 
                pegs[to].push(pegs[from].pop());
                pegs.steps = pegs.steps + 1;
                history.push(record_state(pegs));
            } else {
                move_n_disks(pegs, from, free_peg, n - 1);
                pegs[to].push(pegs[from].pop());
                pegs.steps = pegs.steps + 1;
                history.push(record_state(pegs))
                move_n_disks(pegs, free_peg, to, n - 1);
            }
        }

        move_n_disks(pegs, 'a', 'b', n);

        return history; 
    }

    var hanoi_step_solver = function(n) {
        
        var print_state = generate_state_publisher(callback);

        var mid = 'mid';

        var step_move_disk = function(pegs, from, to) {
            if((from === 'a' && to === 'b') || (from === 'b' && to === 'a')) {
                pegs[mid].push(pegs[from].pop());
                print_state(pegs);
                pegs[to].push(pegs[mid].pop());
            } else {
                pegs[to].push(pegs[from].pop());
            }
        }

        var step_move_n_disks = function(pegs, from, to, n) {
            var free_peg = _.first(_.difference(_.keys(pegs), [from, to]));
            if(n === 1) { 
                step_move_disk(pegs, from, to);
                print_state(pegs);
            } else {
                step_move_n_disks(pegs, from, to, n - 1);
                step_move_disk(pegs, from, mid);
                print_state(pegs);
                step_move_n_disks(pegs, to, from, n - 1);
                step_move_disk(pegs, mid, to);
                print_state(pegs);
                step_move_n_disks(pegs, from, to, n - 1);
            }
        }

        var pegs = setup_hanoi(n);
        print_state(pegs, 0);
        step_move_n_disks(pegs, 'a', 'b', n);

        return pegs.steps;
    }

    return {
        moves: hanoi_num,
        step_moves: hanoi_step_num,
        solver: hanoi_solver,
        step_solver: hanoi_step_solver,
        setup_hanoi: setup_hanoi
    }
        
});