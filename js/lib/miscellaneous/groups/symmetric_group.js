define(['lib/utilities', 'deps/under'], function(utilities, underscore) {

    var _ = underscore._;

    var SymmetricGroup = function(n) {
        this.n = n;

        this.name = "S" + n + "";
        this.long_name = "Symmetric Group on " + this.n + " Elements";

        var SymmetricGroupElement = function() { 
            var counter = 0;
            return function(, exp_r) {
                this.s = exp_s % 2;
                this.r = exp_r % n;
                this.id = counter;
                counter = counter + 1;
            }
        }();

        SymmetricGroupElement.prototype.toString = function() {
            if(this.s === 0 && this.r === 0) { return "1"; }
            return (this.s ? "s" : "") + (this.r ? ("r^" + this.r) : "");
        }

        SymmetricGroupElement.prototype.toHTMLString = function() {
            if(this.s === 0 && this.r === 0) { return "1"; }
            return (this.s ? "s" : "") + (this.r ? ("r<svg:tspan style=\"baseline-shift: sup;\">" + this.r + "</svg:tspan>") : "");
        }

        this.elements = []; 
        
        for(var i = 0; i < n; i++) {
            this.elements[2 * i] = new SymmetricGroupElement(0, i);
            this.elements[2 * i + 1] = new SymmetricGroupElement(1, i);
        }

        this.elements = _.sortBy(this.elements, function(e) { return e.s * n + e.r; });

    }

    SymmetricGroup.prototype.print_group = function() {
        _.map(this.elements, function(e) { 
            console.log(e.toString());
        });
    }

    SymmetricGroup.prototype.e = function(str) {
        return _.find(this.elements, function(e) { return e.toString() === str; });
    }

    SymmetricGroup.prototype.get = function(s, r) {
        var s = s % 2;
        var r = r % this.n;
        return _.find(this.elements, function(e) { return (e.s === s) && (e.r === r); });
    }

    SymmetricGroup.prototype.multiply = function(a, b) {
        var s = (a.s + b.s) % 2;
        var r;
        if(b.s) { r = ((this.n - a.r) + b.r) % this.n; }
        else { r = (a.r + b.r) % this.n; }
        return this.get(s, r);
    }

    SymmetricGroup.prototype.group_multiplication_table = function() {
        var self = this;
        return _.map(self.elements, function(a) { 
            return _.map(self.elements, function(b) {
                return self.multiply(a, b);
            });
        });
    }
    
    return SymmetricGroup;
});