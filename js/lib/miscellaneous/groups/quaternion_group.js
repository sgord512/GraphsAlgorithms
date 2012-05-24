define(['lib/utilities', 'deps/under'], function(utilities, underscore) {

    var _ = underscore._;

    var QuaternionGroup = function() {
        var self = this;
        this.n = 8;
        this.order = 8;
        this.name = "Q"
        this.long_name = "Quaternion Group"

        var QuaternionGroupElement = function() { 
            var counter = 0;
            return function(str, negative) {
                this.s = str;
                if(!_.isUndefined(negative)) {
                    this.negative = negative % 2; 
                } else { 
                    this.negative =  0; 
                }
                this.id = counter;
                counter = counter + 1;
            }
        }();

        QuaternionGroupElement.prototype.toString = function() {
            return (this.negative ? "-" : "") + this.s;
        }

        this.elements = []; 
        _.each(["1", "i", "j", "k"], function(d, i) {
            self.elements[2 * i] = new QuaternionGroupElement(d, 0);
            self.elements[2 * i + 1] = new QuaternionGroupElement(d, 1);
        });

        this.elements = _.sortBy(this.elements, function(d) { return d.id; });

    }

    QuaternionGroup.prototype.print_group = function() {
        _.map(this.elements, function(e) { 
            console.log(e.toString());
        });
    }

    QuaternionGroup.prototype.e = function(str) {
        return _.find(this.elements, function(e) { return e.toString() === str; });
    }

    QuaternionGroup.prototype.get = function(s, negative) {
        var neg = negative % 2;
        return _.find(this.elements, function(e) { return (e.s === s) && (e.negative === neg); });
    }

    QuaternionGroup.prototype.multiply = function(a, b) {
        var negatives = a.negative + b.negative;

        var matches = function(given) {
            return _.isEmpty(_.difference(given, [a.s,b.s]));
        }

        if(matches(["i","j"])) {
            return this.get("k", (a.s === "i" ? 0 : 1) + negatives);

        } else if(matches(["j","k"])) {
            return this.get("i", (a.s === "j" ? 0 : 1) + negatives);

        } else if(matches(["k","i"])) {
            return this.get("j", (a.s === "k" ? 0 : 1) + negatives);

        } else if(a.s === "1") {
            return this.get(b.s, negatives);

        } else if(b.s === "1") { 
            return this.get(a.s, negatives); 

        } else if(a.s === b.s) {
            return this.get("1", 1 + negatives);

        }
    }

    QuaternionGroup.prototype.group_multiplication_table = function() {
        var self = this;
        return _.map(self.elements, function(a) { 
            return _.map(self.elements, function(b) {
                return self.multiply(a, b);
            });
        });
    }
    
    return QuaternionGroup;
});