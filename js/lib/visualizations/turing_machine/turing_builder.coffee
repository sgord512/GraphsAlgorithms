define(['deps/under',
        'cs!lib/miscellaneous/turing_machine'], (underscore, TM) ->

    _ = underscore._

    class Rule
      constructor: (state, symbol, delta) ->
        @state = state
        @symbol = symbol
        @delta = delta
      matches: (state, symbol) ->
        @state.matches(state) and @symbol.matches(symbol)
        
    catchAllDelta = () ->
      new TM.Delta(new TM.Action.Halt(), new TM.State.H())

    firstMatch = (state, symbol, rules) ->
      index = 0
      matchFound = false
      while ((not matchFound) and index < rules.length)
        if rules[index].matches(state, symbol)
          match = rules[index].delta
          matchFound = true
        index = index + 1
      match = catchAllDelta() if not matchFound
      match

    builder = (parsed) ->
      {alphabet: alphabet, states: states, rules: rules} = parsed

      alphabet.push(new TM.Symbol.B())
      states.push(new TM.State.H())

      program = {}
      for state in states
        instruction = {}
        for symbol in alphabet
          instruction[symbol.canonical()] =
            firstMatch(state, symbol, rules)
          instruction[symbol.canonical()].__symbol__ = symbol
        program[state.canonical()] = instruction
        program[state.canonical()].__state__ = state

      program
    
    exported_names =
      Rule: Rule
      builder: builder

    exported_names
)