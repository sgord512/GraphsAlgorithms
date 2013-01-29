// Generated by CoffeeScript 1.4.0
(function() {

  define(['deps/under', 'cs!lib/miscellaneous/turing_machine'], function(underscore, TM) {
    var Rule, builder, catchAllDelta, exported_names, firstMatch, _;
    _ = underscore._;
    Rule = (function() {

      function Rule(state, symbol, delta) {
        this.state = state;
        this.symbol = symbol;
        this.delta = delta;
      }

      Rule.prototype.matches = function(state, symbol) {
        return this.state.matches(state) && this.symbol.matches(symbol);
      };

      return Rule;

    })();
    catchAllDelta = function() {
      return new TM.Delta(new TM.Action.Halt(), new TM.State.H());
    };
    firstMatch = function(state, symbol, rules) {
      var index, match, matchFound;
      index = 0;
      matchFound = false;
      while ((!matchFound) && index < rules.length) {
        if (rules[index].matches(state, symbol)) {
          match = rules[index].delta;
          matchFound = true;
        }
        index = index + 1;
      }
      if (!matchFound) {
        match = catchAllDelta();
      }
      return match;
    };
    builder = function(parsed) {
      var alphabet, instruction, program, rules, state, states, symbol, _i, _j, _len, _len1;
      alphabet = parsed.alphabet, states = parsed.states, rules = parsed.rules;
      alphabet.push(new TM.Symbol.B());
      states.push(new TM.State.H());
      program = {};
      for (_i = 0, _len = states.length; _i < _len; _i++) {
        state = states[_i];
        instruction = {};
        for (_j = 0, _len1 = alphabet.length; _j < _len1; _j++) {
          symbol = alphabet[_j];
          instruction[symbol.canonical()] = firstMatch(state, symbol, rules);
          instruction[symbol.canonical()].__symbol__ = symbol;
        }
        program[state.canonical()] = instruction;
        program[state.canonical()].__state__ = state;
      }
      return program;
    };
    exported_names = {
      Rule: Rule,
      builder: builder
    };
    return exported_names;
  });

}).call(this);
