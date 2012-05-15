define(['lib/utilities', 'deps/under'], function(utilities, underscore) {
    
    var _ = underscore._;

    var Stack = {};
    
    Stack = function() {
        this.arr = [];
        this.next_slot = 0;
    }

    Stack.prototype.push = function(e) {
        this.arr[this.next_slot] = e;
        this.next_slot = this.next_slot + 1;
    }

    Stack.prototype.pop = function() {
        var popped = this.arr[this.next_slot - 1];
        this.arr[this.next_slot - 1] = undefined;
        this.next_slot = this.next_slot - 1;
        return popped;
    }
    
    Stack.prototype.contents = function() {
        var contents = [];
        for(var i = 0; i < this.next_slot; i++) {
            contents[i] = { position: i, value: this.arr[i] };
        }
        return contents;
    }

    Stack.prototype.toString = function() {
        var str = "";
        for(var i = 0; i < this.next_slot; i++) {
            str = str + this.arr[i] + " ";
        }
        return "[" + str.slice(0,-1) + ")";
    }

    return Stack;

});
