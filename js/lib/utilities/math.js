define([], function() {

    var factorial = function(n) {
        var product = 1;
        if(n < 0) { 
            throw new Error("Argument to factorial must be non-negative integer."); 
        } else { 
            for(var i = 0; i <= n; i++) {
                if(i === 0) {
                    product = product * 1;
                } else {
                    product = product * i;
                }
            }
        }
        return product;
    }

    var divides = function(n, d) {
        if(n === 0) {
            if(d !== 0) { 
                return true;
            } else { 
                return false;
            }
        } else { 
            return (d % n === 0);
        }
    }
    
    // Euclid's algorithm for computing GCD
    var greatest_common_divisor = function(a, b) {
        var q, r;
        if(a === b) { return a; }
        else if(a > b) { 
            r = a % b;
            q = b;
        } else if(a < b) { 
            r = b % a;
            q = a;
        }
        while(q % r) {
            var r_new = q % r;
            q = r;
            r = r_new;
        }
        return r;
    }

    var least_common_multiple = function(a, b) { 
        var gcd = greatest_common_divisor(a, b);
        return (a / gcd) * (b / gcd) * gcd;
    }

    return {

        factorial: factorial,
        divides: divides,
        greatest_common_divisor: greatest_common_divisor,
        gcd: greatest_common_divisor,
        least_common_multiple: least_common_multiple,
        lcm: least_common_multiple
    }

});
