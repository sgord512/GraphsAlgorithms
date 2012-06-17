define(['lib/utilities', 'deps/under', 'lib/data_structures/stack'], function(utilities, underscore, Stack) {

    var _ = underscore._;
    
    var generate_id = utilities.id_generator();

    var hanoi_num = utilities.memoize(function(n) {
        return (n === 1) ? 1 : 2*hanoi_num(n - 1) + 1;
    });

    var hanoi_step_num = utilities.memoize(function(n) {
        return (n === 1) ? 2 : 3*hanoi_step_num(n - 1) + 2;
    });

    var Disk = function(size, label) {
        this.size = size;
        this.label = label || String(size);
    }

    var setup_pegs = function(n) {
        var a = new Stack();
        for(var i = 0; i < n; i++) {
            a.push(new Disk(n - i));
        }
        return { a: a, mid: new Stack(), b: new Stack() };
    }

    var edge_peg = function(p) { return p === 'a' || p === 'b'; }
    var middle_peg = function(p) { return p === 'mid'; }

    var Hanoi = function() {
        if(arguments.length === 0) { config = Hanoi.variants.standard }
        else if(arguments.length === 1) {
            if(_.isNumber(arguments[0])) {
                config = _.clone(Hanoi.variants.standard);
                config.number_disks = arguments[0];
            } else if(_.isObject(arguments[0])) {
                config = arguments[0];
            } else throw new Error("Expecting number or config object! Type of argument was incorrect.");
        }
        this.number_disks = config.number_disks;
        this.move_n_disks = config.move_n_disks;
        this.generate_start_state = config.starting_state;
        this.pegs = this.generate_start_state();        
        this.is_valid_move = function(move) { 
            var disks_to_move = this.pegs[move.from].height() !== 0;
            if(disks_to_move) {
                var disk_at_dest = this.pegs[move.to].peek();
                var smaller_on_top = _.isUndefined(disk_at_dest) || this.pegs[move.from].peek().size <= disk_at_dest.size
            }
            var respects_rules = config.is_valid_move(move);
            return disks_to_move && smaller_on_top && respects_rules;
        }
        this.start_peg = config.start;
        this.end_peg = config.end;
    }

    Hanoi.prototype.print_state = function() {
        pegs = this.pegs;
        console.log("a: " + pegs.a);
        console.log("mid: " + pegs.mid);
        console.log("b: " + pegs.b);
        console.log("---------------------");
    }

    Hanoi.prototype.record_state = function() {
        pegs = this.pegs;
        return [{ name: 'a', value: pegs.a.contents() },
                { name: 'mid', value: pegs.mid.contents() },
                { name: 'b', value: pegs.b.contents() }];
    }

    Hanoi.prototype.move_disk = function(move) {
        var to = move.to;
        var from = move.from;
        this.pegs[to].push(this.pegs[from].pop());        
    }

    Hanoi.prototype.is_solved = function() {
        return this.pegs.b.length() === this.number_disks; 
    }

    Hanoi.prototype.reset = function() {
        this.pegs = this.generate_start_state();
    }

    Hanoi.variants = { standard:
                       { name: "Standard",
                         number_disks: 8,
                         move_n_disks: function(pegs, from, to, n) {
                             var free_peg = _.first(_.difference(_.keys(pegs), [from, to]));
                             if(n === 1) { 
                                 pegs[to].push(pegs[from].pop());
                                 pegs.steps = pegs.steps + 1;
                             } else {
                                 move_n_disks(pegs, from, free_peg, n - 1);
                                 pegs[to].push(pegs[from].pop());
                                 pegs.steps = pegs.steps + 1;
                                 move_n_disks(pegs, free_peg, to, n - 1);
                             }
                         },
                         starting_state: function() { return setup_pegs(8); },
                         is_valid_move: function(move) { return move.from !== move.to },
                         start: 'a',
                         end: 'b' },
                       must_step_through_middle: 
                       { name: "No direct moves b/w left and right pegs",
                         number_disks: 8,
                         move_n_disks: function(pegs, from, to, n) {
                             var mid = 'mid'
                             
                             var step_move_disk = function(pegs, from, to) {
                                 if((from === 'a' && to === 'b') || (from === 'b' && to === 'a')) {
                                     pegs[mid].push(pegs[from].pop());
                                     pegs[to].push(pegs[mid].pop());
                                 } else {
                                     pegs[to].push(pegs[from].pop());
                                 }
                             }

                             var free_peg = _.first(_.difference(_.keys(pegs), [from, to]));

                             if(n === 1) { 
                                 step_move_disk(pegs, from, to);
                             } else {
                                 step_move_n_disks(pegs, from, to, n - 1);
                                 step_move_disk(pegs, from, mid);
                                 step_move_n_disks(pegs, to, from, n - 1);
                                 step_move_disk(pegs, mid, to);
                                 step_move_n_disks(pegs, from, to, n - 1);
                             }
                         },
                         starting_state: function() { return setup_pegs(8); },
                         is_valid_move: function(move) { return edge_peg(move.from) && middle_peg(move.to) || 
                                                                middle_peg(move.from) && edge_peg(move.to) },
                         start: 'a',
                         end: 'b' }
                     }

    return Hanoi;
        
});