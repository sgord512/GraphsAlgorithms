define(['lib/utilities', 'deps/under'], function(utilities, underscore) {
    
    var _ = underscore._;

    var Link = {};

    Link = function(prev, value, next) {
        this.value = value;
        this.next = next;
        this.prev = prev;
        if(this.prev) { this.prev.next = this; }
        if(this.next) { this.next.prev = this; }
    }

    var Queue = {};
    
    Queue = function() {
        this.size = 0;
        this.tail = undefined;
        this.head = undefined;
    }

    Queue.prototype.enqueue = function(e) {
        if(this.size === 0) {
            var link = new Link(undefined, e, undefined);
            this.tail = link; 
            this.head = link;
        } else { 
            this.tail = new Link(this.tail, e, undefined);
        }
        this.size = this.size + 1;
        return this;
    }

    Queue.prototype.dequeue = function() {
        if(this.size === 0) {
            return undefined;
        } else { 
            var removed = this.head;
            this.head = this.head.next;
            if(this.head) { this.head.prev = undefined; }
            else { this.tail = undefined; }
            this.size = this.size - 1;
            return removed.value;
        }
    }
    
    Queue.prototype.toString = function() {
        if(this.size === 0) {
            return "<- <"; 
        } else {
            var curr = this.head;
            var str = curr + " <- "
            while(curr.next) { 
                curr = curr.next;
                str = str + curr + ", ";
            }
            return str.slice(0, -2)  + " <";
        }
    }

    return Queue;

});
