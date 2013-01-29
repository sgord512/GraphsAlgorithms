define(['deps/under',
        'cs!lib/miscellaneous/turing_machine'
        'cs!lib/visualizations/turing_machine/turing_builder'], (underscore, TM, builder) ->

    _ = underscore._

    class Pre
       @create: (str,cls) ->
        if str == "_"
          new Any()
        else
          new Spec(cls.create(str))
    class Any extends Pre
      constructor: () -> 
      matches: (token) -> true
      show: () -> "_"
    class Spec extends Pre
      constructor: (val) ->
        @val = val
      matches: (val) ->
        @val.matches(val)
      show: () -> @val.show()
    Pre.Any = Any
    Pre.Spec = Spec

    ref = (text) ->
      "(".concat(text).concat(")")

    orWildcardRef = (text) ->
      "((?:".concat(text).concat(")|_)")

    orNothingRef = (text) ->
      "((?:".concat(text).concat(")|\\s*)")
    
    alphabetString = "Alphabet: "
    stateSetString = "States: "
    symbolString = "[a-zA-Z][a-zA-Z0-9]*"
    stateString = "[a-zA-Z][a-zA-Z0-9]*"
    actionString = "[EHLR]|(?:W\\(".concat(symbolString).concat("\\))")
    tapePhraseString = "(?:([0-9])\s*\\*)?\s*".concat(ref(symbolString))

    parseTape = (text) ->
      tapePhrase = new RegExp(tapePhraseString,"g")
      phrase = tapePhrase.exec(text)
      tape = []
      while phrase
        [str, count, sym] = phrase
        if count
          tape.push(TM.Symbol.create(sym)) for n in _.range(0, Number(count))
        else
          tape.push(TM.Symbol.create(sym))
        phrase = tapePhrase.exec(text)
      tape

    parseInput = (text) ->
      stateAmpersandRegExp = new RegExp(ref(stateString).concat("\\s*&"))
      stateResult = stateAmpersandRegExp.exec(text)
      state = TM.State.create(stateResult[1])
      tape = parseTape(text.substring(stateResult.index + stateResult[0].length))
      {
        state: state
        tape: tape
      }
      
          
    parseAlphabet = (text) ->
      sym = new RegExp(symbolString,"g")
      textRest = text.substring(text.match(alphabetString).index + alphabetString.length)
      (TM.Symbol.create(s) for s in textRest.match(sym))

    parseStates = (text) ->
      state = new RegExp(stateString,"g")
      textRest = text.substring(text.match(stateSetString).index + stateSetString.length)
      (TM.State.create(s) for s in textRest.match(state))

    parseRule = (text) ->
      ruleRegExp = orWildcardRef(symbolString)
        .concat("\\s*:\\s*")
        .concat(orWildcardRef(stateString))
        .concat("\\s*->\\s*")
        .concat(ref(actionString))
        .concat("\\s*;\\s*")
        .concat(orNothingRef(stateString))

      results = text.match(new RegExp(ruleRegExp))

      if results?.length >= 5
        rule =
          state: Pre.create(results[1],TM.State)
          symbol: Pre.create(results[2],TM.Symbol)
          delta: new TM.Delta(TM.Action.create(results[3]), TM.State.create(results[4]))
        new builder.Rule(rule.state, rule.symbol, rule.delta)
      else undefined

    parseTM = (text) ->
      lines = text.split("\n")     
      alphabet = parseAlphabet(lines[0]) ? undefined
      stateSet = parseStates(lines[1]) ? undefined
      rules = (parseRule(rule) for rule in lines[2..])
      {
        alphabet: alphabet
        states: stateSet
        rules: _.compact(rules)
      }
       
    exported_names =
      Pre: Pre
      parseTM: parseTM
      parseInput: parseInput

    exported_names
)