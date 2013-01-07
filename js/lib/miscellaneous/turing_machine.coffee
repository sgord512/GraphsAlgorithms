define(["deps/under", "lib/utilities"], (underscore, utilities) -> 

    _ = underscore._

    class Maybe
      constructor: (val) ->
        if val? then new Just(val) else new Nothing()
    class Nothing
      constructor: () ->
      isNothing: () -> true
      fmap: (f) -> new Nothing()
    class Just
      constructor: (val) ->
        @val = val
      isNothing: () -> false
      fromJust: () -> @val
      fmap: (f) -> new Just(f(@val))
    Maybe.Nothing = Nothing
    Maybe.Just = Just

    class Symbol
      @create: (sym) ->
        if (not sym?) or (sym is 'B')
          new B()
        else
          new Sym(sym)
      inspect: (depth) -> @show()
    class Sym extends Symbol
      constructor: (sym) ->
        @sym = sym
      blank: () -> false
      show: () -> @sym
      canonical: () -> @sym
      matches: (s) -> not s.blank() and @sym == s.sym
    class B extends Symbol
      constructor: () ->
      blank: () -> true
      show: () -> 'B'
      canonical: () -> 'B'
      matches: (s) -> s.blank()
    Symbol.Sym = Sym
    Symbol.B = B
    
    class State
      @create: (state) ->
        if (not state?) or (state is 'H') or (state is '')
          new H()
        else
          new LiveState(state)
      inspect: (depth) -> @show()
    class LiveState extends State
      constructor: (state) ->
        @state = state
      halt: () -> false
      show: () -> @state
      canonical: () -> @state
      matches: (s) -> not s.halt() and @state == s.state
    class H extends State
      constructor: () ->
      halt: () -> true
      show: () -> 'H'
      canonical: () -> 'H'
      matches: (s) -> s.halt()
    State.LiveState = LiveState
    State.H = H

    class Tape
      constructor: (left, curr, right) ->
        @leftTape = left
        @curr = curr
        @rightTape = right
        @index = 0

      set_curr: (sym) ->
        @curr = sym

      move_left: () ->
        @rightTape.unshift(@curr)
        @curr = @leftTape.shift() ? new B()
        @index = @index - 1

      move_right: () ->
        @leftTape.unshift(@curr)
        @curr = @rightTape.shift() ? new B()
        @index = @index + 1

      show: () ->
        l = @leftTape[..].reverse()
        r = @rightTape[..]
        ls = (sym.show() for sym in l)
        rs = (sym.show() for sym in r)
        (ls.concat(@curr.show()).concat(rs)).join(' ')

    class Action
      @create: (str) ->
        switch str
          when "E" then new Erase()
          when "L" then new Left()
          when "R" then new Right()
          when "H" then new Halt()
          else
            if (str.charAt(0) is 'W')
              new Write(Symbol.create(str.slice(2,str.length - 1)))
            else
              throw "Unknown action"
      inspect: (depth) -> @show()
    class Erase extends Action
      constructor: () ->
      type: () -> "Erase"
      show: () -> 'E'
    class Write extends Action
      constructor: (sym) ->
        @sym = sym
      type: () -> "Write"
      show: () -> "W(".concat(@sym.show()).concat(")")
    class Left extends Action
      constructor: () ->
      type: () -> "Left"
      show: () -> "L"
    class Right extends Action
      constructor: () -> 
      type: () -> "Right"
      show: () -> "R"
    class Halt extends Action
      constructor: () ->
      type: () -> "Halt"
      show: () -> "H"

    Action.Erase = Erase
    Action.Write = Write
    Action.Left = Left
    Action.Right = Right
    Action.Halt = Halt

    class Delta
      constructor: (action, nextState) ->
        @action = action
        @nextState = nextState

    class TuringMachine
      constructor: (program, state, tape) ->
        @program = program
        @state = state
        @tape = tape

      currentDelta: () ->
        if @state.halt()
          new Nothing()
        else
          new Just (@program[@state.canonical()][@tape.curr.canonical()])

      applyDelta: (delta) ->
        {action: action, nextState: nextState} = delta
        @state = nextState
        switch action.type()
          when "Erase" then @tape.set_curr(new B())
          when "Write" then @tape.set_curr(action.sym)
          when "Left" then @tape.move_left()
          when "Right" then @tape.move_right()
          when "Halt" then @tape
            
      initialize: (state, initialTape) ->
        @state = state
        left = []
        curr = initialTape.shift() ? new B()
        right = initialTape ? []
        @tape = new Tape(left, curr, right)

      halted: () ->
        @state.halt()

      step: () ->
        delta = @currentDelta()
        if not delta.isNothing()
          @applyDelta(delta.fromJust())
        else throw "Can't step from halted state"

      showApplicableRule: () ->
        show_rule = (action, nextState) ->
        state.show() + ": " + curr.show() + " -> " + action.show() + "; " + nextState.show()

      showCurrentTape: () -> @tape.show()

    exported_names = 
      TM: TuringMachine
      TuringMachine: TuringMachine
      Action: Action
      Delta: Delta
      State: State
      Symbol: Symbol
      Tape: Tape
      Maybe: Maybe

    exported_names
)