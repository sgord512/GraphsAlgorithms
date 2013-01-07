// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["deps/under", "lib/utilities"], function(underscore, utilities) {
    var Action, B, Erase, H, Halt, Just, Left, LiveState, Maybe, Nothing, Right, State, Sym, Symbol, Tape, TuringMachine, Write, exported_names, _;
    _ = underscore._;
    Maybe = (function() {

      function Maybe(val) {
        if (val != null) {
          new Just(val);
        } else {
          new Nothing();
        }
      }

      return Maybe;

    })();
    Nothing = (function() {

      function Nothing() {}

      Nothing.prototype.isNothing = function() {
        return true;
      };

      Nothing.prototype.fmap = function(f) {
        return new Nothing();
      };

      return Nothing;

    })();
    Just = (function() {

      function Just(val) {
        this.val = val;
      }

      Just.prototype.isNothing = function() {
        return false;
      };

      Just.prototype.fmap = function(f) {
        return new Just(f(this.val));
      };

      return Just;

    })();
    Maybe.Nothing = Nothing;
    Maybe.Just = Just;
    Symbol = (function() {

      function Symbol() {}

      Symbol.create = function(sym) {
        if ((!(sym != null)) || (sym === 'B')) {
          return new B();
        } else {
          return new Sym(sym);
        }
      };

      return Symbol;

    })();
    Sym = (function(_super) {

      __extends(Sym, _super);

      function Sym(sym) {
        this.sym = sym;
      }

      Sym.prototype.blank = function() {
        return false;
      };

      Sym.prototype.show = function() {
        return this.sym;
      };

      return Sym;

    })(Symbol);
    B = (function(_super) {

      __extends(B, _super);

      function B() {}

      B.prototype.blank = function() {
        return true;
      };

      B.prototype.show = function() {
        return 'B';
      };

      return B;

    })(Symbol);
    Symbol.Sym = Sym;
    Symbol.B = B;
    State = (function() {

      function State() {}

      State.create = function(state) {
        if ((!(state != null)) || (state === 'H')) {
          return new H();
        } else {
          return new LiveState(state);
        }
      };

      return State;

    })();
    LiveState = (function(_super) {

      __extends(LiveState, _super);

      function LiveState(state) {
        this.state = state;
      }

      LiveState.prototype.halt = function() {
        return false;
      };

      LiveState.prototype.show = function() {
        return this.state;
      };

      return LiveState;

    })(State);
    H = (function(_super) {

      __extends(H, _super);

      function H() {}

      H.prototype.halt = function() {
        return true;
      };

      H.prototype.show = function() {
        return 'H';
      };

      return H;

    })(State);
    State.LiveState = LiveState;
    State.H = H;
    Tape = (function() {

      function Tape(left, curr, right) {
        this.leftTape = left;
        this.curr = curr;
        this.rightTape = right;
        this.index = 0;
      }

      Tape.prototype.set_curr = function(sym) {
        return this.curr = sym;
      };

      Tape.prototype.left = function() {
        var _ref;
        this.right.unshift(this.curr);
        this.curr = (_ref = this.left.shift()) != null ? _ref : new B();
        return this.index = this.index + 1;
      };

      Tape.prototype.right = function() {
        var _ref;
        this.left.unshift(this.curr);
        this.curr = (_ref = this.right.shift()) != null ? _ref : new B();
        return this.index = this.index - 1;
      };

      Tape.prototype.show = function() {
        var l, ls, rs, sym, _i, _j, _len, _len1;
        l = this.left.slice(0).reverse();
        for (_i = 0, _len = l.length; _i < _len; _i++) {
          sym = l[_i];
          ls = sym.show();
        }
        for (_j = 0, _len1 = r.length; _j < _len1; _j++) {
          sym = r[_j];
          rs = sym.show();
        }
        return ls.join(' ').concat(this.curr.show()).concat(rs.join(' '));
      };

      return Tape;

    })();
    Action = (function() {

      function Action() {}

      Action.create = function(str) {
        console.log(str);
        switch (str) {
          case "E":
            return new Erase();
          case "L":
            return new Left();
          case "R":
            return new Right();
          case "H":
            return new Halt();
          default:
            if (str.charAt(0) === 'W') {
              return new Write(Symbol.create(str.slice(2, str.length - 1)));
            } else {
              throw "Unknown action";
            }
        }
      };

      return Action;

    })();
    Erase = (function(_super) {

      __extends(Erase, _super);

      function Erase() {}

      Erase.prototype.type = function() {
        return "Erase";
      };

      Erase.prototype.show = function() {
        return 'E';
      };

      return Erase;

    })(Action);
    Write = (function(_super) {

      __extends(Write, _super);

      function Write(sym) {
        this.sym = sym;
      }

      Write.prototype.type = function() {
        return "Write";
      };

      Write.prototype.show = function() {
        return "W(".concat(this.sym.show()).concat(")");
      };

      return Write;

    })(Action);
    Left = (function(_super) {

      __extends(Left, _super);

      function Left() {}

      Left.prototype.type = function() {
        return "Left";
      };

      Left.prototype.show = function() {
        return "L";
      };

      return Left;

    })(Action);
    Right = (function(_super) {

      __extends(Right, _super);

      function Right() {}

      Right.prototype.type = function() {
        return "Right";
      };

      Right.prototype.show = function() {
        return "R";
      };

      return Right;

    })(Action);
    Halt = (function(_super) {

      __extends(Halt, _super);

      function Halt() {}

      Halt.prototype.type = function() {
        return "Halt";
      };

      Halt.prototype.show = function() {
        return "H";
      };

      return Halt;

    })(Action);
    Action.Erase = Erase;
    Action.Write = Write;
    Action.Left = Left;
    Action.Right = Right;
    Action.Halt = Halt;
    TuringMachine = (function() {

      function TuringMachine(program, state, tape) {
        this.program = program;
        this.state = state;
        this.tape = tape;
      }

      TuringMachine.prototype.currentDelta = function() {
        if (this.state.halt()) {
          return new Nothing();
        } else {
          return new Just(this.program[this.state][this.tape.curr]);
        }
      };

      TuringMachine.prototype.applyDelta = function(delta) {
        var action, nextState;
        action = delta.action, nextState = delta.nextState;
        this.state = nextState;
        switch (action.type()) {
          case "Erase":
            this.tape.set_curr(new B());
            break;
          case "Write":
            this.tape.set_curr(action.sym);
            break;
          case "Left":
            this.tape.left();
            break;
          case "Right":
            this.tape.right();
            break;
          case "Halt":
            this.tape;
        }
        return {
          initialize: function(state, initialTape) {
            this.state = state;
            return this.tape = new Tape([], initialTape.shift(), initialTape);
          },
          halted: function() {
            return this.state.halt();
          },
          step: function() {
            delta = this.currentDelta();
            if (!delta.isNothing()) {
              throw "Can't step from halted state";
            }
          },
          showApplicableRule: function() {
            var show_rule;
            show_rule = function(action, nextState) {};
            return state.show() + ": " + curr.show() + " -> " + action.show() + "; " + nextState.show();
          },
          showCurrentTape: function() {
            return this.curr.show();
          }
        };
      };

      return TuringMachine;

    })();
    exported_names = {
      TM: TuringMachine,
      Action: Action,
      State: State,
      Symbol: Symbol,
      Tape: Tape,
      Maybe: Maybe
    };
    return exported_names;
  });

}).call(this);
