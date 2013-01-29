// Generated by CoffeeScript 1.4.0
(function() {

  define(['deps/under', 'deps/d3', 'cs!lib/miscellaneous/turing_machine', 'cs!lib/visualizations/turing_machine/turing_parser', 'cs!lib/visualizations/turing_machine/turing_builder', 'cs!lib/visualizations/turing_machine/turing_page_helper', 'lib/utilities/d3_helper'], function(underscore, d3, TM, parser, builder, tm_h, d3_helper) {
    var center_square_nw_corner, del, dur, h, last_index, middle_x, moved, setup_tape, small_triangle, spacing, square_side, step, tm_helper, triangle, unit, w, _;
    _ = underscore._;
    d3 = d3;
    h = screen.availHeight - 150;
    w = screen.availWidth - 50;
    step = 500;
    unit = 40;
    spacing = 4;
    square_side = unit - spacing;
    tm_helper = tm_h({
      unit: unit,
      spacing: spacing,
      square_side: square_side
    });
    dur = (3 / 8) * step;
    del = (3 / 8) * step;
    middle_x = w / 2;
    last_index = 0;
    moved = false;
    center_square_nw_corner = {
      x: middle_x - (square_side / 2),
      y: spacing
    };
    triangle = [
      {
        x: square_side / 2,
        y: 0
      }, {
        x: 0 - spacing,
        y: square_side
      }, {
        x: unit,
        y: square_side
      }
    ];
    small_triangle = [
      {
        x: square_side / 2,
        y: 0
      }, {
        x: 0,
        y: square_side
      }, {
        x: square_side,
        y: square_side
      }
    ];
    setup_tape = function(tape) {
      var curr, i, index, left, ls, n, num_extra_ls, num_extra_rs, num_ls, num_rs, right, rs, sliced_ls, sliced_rs, square, _i, _j, _len, _len1;
      left = tape.leftTape, curr = tape.curr, right = tape.rightTape, index = tape.index;
      if (index > last_index) {
        moved = {
          tapeToTheLeft: true
        };
      } else if (index < last_index) {
        moved = {
          tapeToTheLeft: false
        };
      } else {
        moved = false;
      }
      last_index = index;
      num_ls = Math.ceil((center_square_nw_corner.x / unit) + 1);
      num_rs = Math.ceil(((w - (center_square_nw_corner.x + unit)) / unit) + 1);
      num_extra_ls = num_ls - left.length;
      num_extra_rs = num_rs - right.length;
      if (num_extra_rs < 0) {
        num_extra_rs = 0;
      }
      if (num_extra_ls < 0) {
        num_extra_ls = 0;
      }
      ls = left.slice(0).concat((function() {
        var _i, _len, _ref, _results;
        _ref = _.range(0, num_extra_ls);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          _results.push(new TM.Symbol.B());
        }
        return _results;
      })());
      rs = right.slice(0).concat((function() {
        var _i, _len, _ref, _results;
        _ref = _.range(0, num_extra_rs);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          n = _ref[_i];
          _results.push(new TM.Symbol.B());
        }
        return _results;
      })());
      sliced_ls = ls.slice(0, num_ls - 1);
      sliced_rs = rs.slice(0, num_rs - 1);
      for (i = _i = 0, _len = sliced_ls.length; _i < _len; i = ++_i) {
        square = sliced_ls[i];
        square.num = index - (i + 1);
        square.offset = 0 - (i + 1);
      }
      for (i = _j = 0, _len1 = sliced_rs.length; _j < _len1; i = ++_j) {
        square = sliced_rs[i];
        square.num = index + (i + 1);
        square.offset = 0 + (i + 1);
      }
      curr.num = index;
      curr.offset = 0;
      sliced_ls.reverse();
      return {
        tape: sliced_ls.concat(curr).concat(sliced_rs),
        moved: moved
      };
    };
    return function() {
      var adjust_enter, adjust_exit, canvas, container, draw_head, draw_rules, draw_tape, draw_turing_machine, initialize_head, machine_head, machine_head_small, rule_action, sketchpad, sq_translation, stepper, tape_square, tape_square_symbol, tm;
      sketchpad = d3.select("#sketchpad");
      canvas = sketchpad.append("svg:svg").attr("height", h).attr("width", w).attr("shape-rendering", 'geometricPrecision');
      canvas.style("background-color", 'black');
      container = canvas.append("svg:g").classed("container", true);
      container.append("svg:g").classed("tape", true);
      container.append("svg:g").classed("head", true);
      container.append("svg:g").classed("rules", true);
      sq_translation = function(offset) {
        return d3_helper.transforms.translation(offset * unit + center_square_nw_corner.x, center_square_nw_corner.y);
      };
      adjust_enter = function(offset) {
        if (moved != null) {
          if (moved.tapeToTheLeft) {
            return offset + 1;
          } else {
            return offset - 1;
          }
        } else {
          return offset;
        }
      };
      adjust_exit = function(offset) {
        if (moved != null) {
          if (moved.tapeToTheLeft) {
            return offset - 1;
          } else {
            return offset + 1;
          }
        } else {
          return offset;
        }
      };
      tape_square = function(g) {
        return g.append("svg:rect").attr("width", square_side).attr("height", square_side).attr("fill", 'white');
      };
      tape_square_symbol = function(g, symbol) {
        return g.append("svg:text").attr("y", square_side - spacing).attr("x", spacing).attr("fill", 'orange').text(symbol);
      };
      machine_head_small = function(g, state) {
        g.append("svg:polygon").attr("points", d3_helper.polygon(small_triangle)).attr("fill", 'aquamarine');
        return g.append("svg:text").attr("y", square_side - spacing).attr("x", square_side / 2 - spacing - 3).attr("fill", 'darkmagenta').text(state);
      };
      machine_head = function(g, state) {
        g.append("svg:polygon").attr("points", d3_helper.polygon(triangle)).attr("fill", 'aquamarine');
        return g.append("svg:text").attr("y", square_side - spacing).attr("x", square_side / 2 - spacing - 1).attr("fill", 'darkmagenta').text(state);
      };
      rule_action = function(g) {
        g.append("svg:polygon").attr("points", function(d) {
          return tm_helper.action_spec(d).polygon.points;
        }).attr("fill", function(d) {
          return tm_helper.action_spec(d).polygon.fill;
        }).attr("visibility", function(d) {
          return tm_helper.action_spec(d).polygon.visibility;
        });
        return g.append("svg:text").attr("x", function(d) {
          return tm_helper.action_spec(d).text.x;
        }).attr("y", function(d) {
          return tm_helper.action_spec(d).text.y;
        }).attr("fill", function(d) {
          return tm_helper.action_spec(d).text.fill;
        }).text(function(d) {
          return tm_helper.action_spec(d).text.text;
        }).attr("visibility", function(d) {
          return tm_helper.action_spec(d).text.visibility;
        });
      };
      draw_rules = function(program) {
        var action_e, nextState_e, rule, rule_e, rules, rules_g, state_e, symbol_e;
        rules = tm_helper.setup_rules(program);
        rules_g = container.select("g.rules");
        rule = rules_g.selectAll("g.rule").data(rules);
        rule_e = rule.enter().append("svg:g").classed("rule", true).attr("transform", function(d, i) {
          return d3_helper.transforms.translation(spacing, spacing + (2 * unit * i));
        });
        state_e = rule_e.append("svg:g").classed("state", true).attr("transform", d3_helper.transforms.translation(0, unit));
        machine_head_small(state_e, function(d) {
          return d.state.show();
        });
        symbol_e = rule_e.append("svg:g").classed("symbol", true).attr("transform", d3_helper.transforms.translation(0, spacing));
        tape_square(symbol_e);
        tape_square_symbol(symbol_e, function(d) {
          if (d.symbol.blank()) {
            return "";
          } else {
            return d.symbol.show();
          }
        });
        action_e = rule_e.append("svg:g").classed("action", true).attr("transform", d3_helper.transforms.translation(unit, spacing));
        rule_action(action_e);
        nextState_e = rule_e.append("svg:g").classed("next_state", true).attr("transform", d3_helper.transforms.translation(unit, unit));
        return machine_head_small(nextState_e, function(d) {
          return d.delta.nextState.show();
        });
      };
      draw_tape = function(tape, noTransition) {
        var prepped_tape, square, square_e, tape_g;
        tape_g = container.select("g.tape");
        prepped_tape = setup_tape(tape).tape;
        square = tape_g.selectAll("g.square").data(prepped_tape, function(d) {
          return d.num;
        });
        square.select("text").text(function(d) {
          if (d.blank()) {
            return "";
          } else {
            return d.show();
          }
        });
        square.transition().delay(del).duration(dur).attr("transform", function(d) {
          return sq_translation(d.offset);
        });
        square_e = square.enter().append("svg:g").classed("square", true);
        tape_square(square_e);
        tape_square_symbol(square_e, function(d) {
          if (d.blank()) {
            return "";
          } else {
            return d.show();
          }
        });
        if (noTransition != null) {
          square_e.attr("transform", function(d) {
            return sq_translation(d.offset);
          });
        } else {
          square_e.attr("transform", function(d) {
            return sq_translation(adjust_enter(d.offset));
          }).transition().delay(del).duration(dur).attr("transform", function(d) {
            return sq_translation(d.offset);
          });
        }
        return square.exit().transition().delay(del).duration(dur).attr("transform", function(d) {
          return sq_translation(adjust_exit(d.offset));
        }).remove();
      };
      initialize_head = function(state) {
        var head_g, head_x, head_y;
        head_g = container.select("g.head");
        head_y = center_square_nw_corner.y + unit;
        head_x = center_square_nw_corner.x;
        head_g.attr("transform", d3_helper.transforms.translation(head_x, head_y));
        return machine_head(head_g, state.show());
      };
      draw_head = function(state) {
        return container.select("g.head").select("text").text(state.show());
      };
      draw_turing_machine = function(tm, noTransition) {
        draw_tape(tm.tape, noTransition);
        draw_head(tm.state);
        return draw_rules(tm.program);
      };
      tm = tm_helper.tm;
      initialize_head(tm.state);
      draw_turing_machine(tm, true);
      stepper = function() {
        if (!tm.halted()) {
          return tm.step();
        } else {
          return draw_turing_machine(tm);
        }
      };
      return setInterval(stepper, step);
    };
  });

}).call(this);
