var flips_required = []

var biased_coin = function(p) { 
    return function() {
        return Math.random() < p;
    }
}

var unbiased_coin = function(biased) {
    var counter = 1;
    var flip1 = biased();
    var flip2 = biased();
    while(flip1 === flip2) {
        flip1 = biased();
        flip2 = biased();
        counter = counter + 1;
    }
    flips_required.push(counter);
    return flip1;
}