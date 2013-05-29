// Generated by CoffeeScript 1.4.0
(function() {
  var Edge;

  Edge = function(start, end) {
    if (start < end) {
      this.start = start;
      this.end = end;
    } else if (start > end) {
      this.start = end;
      this.end = start;
    } else {
      console.log("Self-loop created!");
      this.self_loop = true;
    }
    this.index = Edge.next_index();
    return this.inMST = false;
  };

  Edge.prototype.start_point = function() {
    return points[this.start];
  };

  Edge.prototype.end_point = function() {
    return points[this.end];
  };

  Edge.prototype.weight = function() {
    return Math.sqrt(Math.pow(this.start_point().x - this.end_point().x, 2) + Math.pow(this.start_point().y - this.end_point().y, 2));
  };

  Edge.prototype.addToMST = function() {
    console.log(this + " added to MST!");
    return this.inMST = true;
  };

  Edge.prototype.toString = function() {
    return "index: " + this.index + ", " + this.start + " to " + this.end;
  };

}).call(this);