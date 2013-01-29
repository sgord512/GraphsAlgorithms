define(['deps/under',
        'deps/d3',
        'cs!lib/miscellaneous/turing_machine',
        'cs!lib/visualizations/turing_machine/turing_parser',
        'cs!lib/visualizations/turing_machine/turing_builder',
        'lib/utilities/d3_helper'], (underscore, d3, TM, parser, builder, d3_helper) ->

    _ = underscore._
    d3 = d3

    starting_tm_input_string = "q1 & 4*S1, B, 3*S1"
    starting_tm_program_string = """
      Alphabet: S1
      States: q1, q2, q3, q4, q5
      q1: B -> R; q1
      q1: S1 -> R; q2
      q2: B -> W(S1); q3
      q2: S1 -> R; q2
      q3: B -> L; q4
      q3: S1 -> R; q3
      q4: B -> L; q5
      q4: S1 -> E; q4
      q5: S1 -> L; q5
      q5: B -> H;
    """
    
    parsed_tm_program = parser.parseTM(starting_tm_program_string)
    starting_tm_program = builder.builder(parsed_tm_program)
    starting_tm = new TM.TuringMachine(starting_tm_program)
    starting_tm_input = parser.parseInput(starting_tm_input_string)
    starting_tm.initialize(starting_tm_input.state, starting_tm_input.tape)

    tm = starting_tm

    setup_rules = (program) ->
      rules = []
      for own state, instruction of program
        for own symbol, delta of instruction when symbol isnt "__state__"
          rules.push(
            state: instruction.__state__
            symbol: delta.__symbol__
            delta: delta
          )              
      rules

    (dimensions) ->
      { unit: unit, spacing: spacing, square_side: square_side } = dimensions

      points = d3_helper.polygon

      reflection_over_x = (fixed_x) ->
        (x) ->
          (2 * fixed_x) - x

      reflect_over_half = reflection_over_x(square_side / 2)

      # used for Right action, flipped for Left
      right_arrow = [
        { x: 0, y: square_side / 4 },
        { x: 0, y: 3 * square_side / 4 },
        { x: square_side / 2, y: 3 * square_side / 4 },
        { x: square_side / 2, y: square_side },
        { x: square_side, y: square_side / 2 },
        { x: square_side / 2, y: 0 },
        { x: square_side / 2, y: square_side / 4 }
      ]

      left_arrow = _.map(right_arrow, (point) ->
        { x: x, y: y } = point
        flipped_x = reflect_over_half(x)
        { x: flipped_x, y: y })

      halt_sign = [
        { x: 0, y: 0 },
        { x: 0, y: square_side },
        { x: square_side / 4, y: square_side },
        { x: square_side / 4, y: 5 * square_side / 8 },
        { x: 3 * square_side / 4, y: 5 * square_side / 8 },
        { x: 3 * square_side / 4, y: square_side },
        { x: square_side, y: square_side },
        { x: square_side, y: 0 },
        { x: 3 * square_side / 4, y: 0 },
        { x: 3 * square_side / 4, y: 3 * square_side / 8 },
        { x: square_side / 4, y: 3 * square_side / 8 },
        { x: square_side / 4, y: 0 }
      ]

      square = [
        { x: 0, y: 0 },
        { x: square_side, y: 0 },
        { x: square_side, y: square_side },
        { x: 0, y: square_side }
      ]

      template_spec = () ->
        polygon:
          points: points(square)
          fill: 'white'
          visibility: 'visible'
        text:
          x: spacing
          y: square_side - spacing
          fill: 'lightcoral'
          visibility: 'hidden'
          text: ""

      action_spec = (d) ->
        t = template_spec()
        switch d.delta.action.type()
          when "Erase"
            t
          when "Write"
            t.text.visibility = 'visible'
            t.text.text =
              if d.delta.action.sym.blank() then "" else d.delta.action.sym.show()
          when "Left"            
            t.polygon.points = points(left_arrow)
            t.polygon.fill = 'steelblue'
          when "Right"
            t.polygon.points = points(right_arrow)
            t.polygon.fill = 'steelblue'
          when "Halt"
            t.polygon.points = points(halt_sign)
            t.polygon.fill = 'crimson'
        t
 
      exported_names =
        tm: tm
        starting_tm_program_string: starting_tm_program_string
        starting_tm_input_string: starting_tm_input_string
        setup_rules: setup_rules
        action_spec: action_spec

      exported_names
)