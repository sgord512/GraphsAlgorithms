// Generated by CoffeeScript 1.4.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['deps/under', 'cs!lib/miscellaneous/turing_machine', 'cs!lib/visualizations/turing_machine/turing_builder'], function(underscore, TM, builder) {
    var Any, Pre, Spec, actionString, alphabetString, exported_names, orNothingRef, orWildcardRef, parseAlphabet, parseRule, parseStates, parseTM, ref, stateSetString, stateString, symbolString, _;
    _ = underscore._;
    Pre = (function() {

      function Pre() {}

      Pre.create = function(str, cls) {
        if (str === "_") {
          return new Any();
        } else {
          return new Spec(cls.create(str));
        }
      };

      return Pre;

    })();
    Any = (function(_super) {

      __extends(Any, _super);

      function Any() {}

      Any.prototype.matches = function(token) {
        return true;
      };

      Any.prototype.show = function() {
        return "_";
      };

      return Any;

    })(Pre);
    Spec = (function(_super) {

      __extends(Spec, _super);

      function Spec(val) {
        this.val = val;
      }

      Spec.prototype.matches = function(val) {
        return this.val.matches(val);
      };

      Spec.prototype.show = function() {
        return this.val.show();
      };

      return Spec;

    })(Pre);
    Pre.Any = Any;
    Pre.Spec = Spec;
    alphabetString = "Alphabet: ";
    stateSetString = "States: ";
    symbolString = "[a-zA-Z][a-zA-Z0-9]*";
    stateString = "[a-zA-Z][a-zA-Z0-9]*";
    actionString = "[EHLR]|(?:W\\(".concat(symbolString).concat("\\))");
    ref = function(text) {
      return "(".concat(text).concat(")");
    };
    orWildcardRef = function(text) {
      return "((?:".concat(text).concat(")|_)");
    };
    orNothingRef = function(text) {
      return "((?:".concat(text).concat(")|\\s*)");
    };
    parseAlphabet = function(text) {
      var s, sym, textRest, _i, _len, _ref, _results;
      sym = new RegExp(symbolString, "g");
      textRest = text.substring(text.match(alphabetString).index + alphabetString.length);
      _ref = textRest.match(sym);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(TM.Symbol.create(s));
      }
      return _results;
    };
    parseStates = function(text) {
      var s, state, textRest, _i, _len, _ref, _results;
      state = new RegExp(stateString, "g");
      textRest = text.substring(text.match(stateSetString).index + stateSetString.length);
      _ref = textRest.match(state);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        s = _ref[_i];
        _results.push(TM.State.create(s));
      }
      return _results;
    };
    parseRule = function(text) {
      var results, rule, ruleRegExp;
      ruleRegExp = orWildcardRef(symbolString).concat("\\s*:\\s*").concat(orWildcardRef(stateString)).concat("\\s*->\\s*").concat(ref(actionString)).concat("\\s*;\\s*").concat(orNothingRef(stateString));
      results = text.match(new RegExp(ruleRegExp));
      if ((results != null ? results.length : void 0) >= 5) {
        rule = {
          state: Pre.create(results[1], TM.State),
          symbol: Pre.create(results[2], TM.Symbol),
          delta: new TM.Delta(TM.Action.create(results[3]), TM.State.create(results[4]))
        };
        return new builder.Rule(rule.state, rule.symbol, rule.delta);
      } else {
        return void 0;
      }
    };
    parseTM = function(text) {
      var alphabet, lines, rule, rules, stateSet, _ref, _ref1;
      lines = text.split("\n");
      alphabet = (_ref = parseAlphabet(lines[0])) != null ? _ref : void 0;
      stateSet = (_ref1 = parseStates(lines[1])) != null ? _ref1 : void 0;
      rules = (function() {
        var _i, _len, _ref2, _results;
        _ref2 = lines.slice(2);
        _results = [];
        for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
          rule = _ref2[_i];
          _results.push(parseRule(rule));
        }
        return _results;
      })();
      return {
        alphabet: alphabet,
        states: stateSet,
        rules: _.compact(rules)
      };
    };
    exported_names = {
      Pre: Pre,
      parseTM: parseTM
    };
    return exported_names;
  });

}).call(this);
