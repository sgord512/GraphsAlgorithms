define(['deps/under',
        'deps/d3',
        'cs!lib/miscellaneous/turing_machine',
        'cs!lib/visualizations/turing_machine/turing_parser',
        'cs!lib/visualizations/turing_machine/turing_builder'
        'cs!lib/visualizations/turing_machine/turing_page_helper'        
        'lib/utilities/d3_helper'], (underscore, d3, TM, parser, builder, tm_h, d3_helper) ->

    _ = underscore._
    d3 = d3

    h = screen.availHeight - 150
    w = screen.availWidth - 50
    step = 500
    unit = 40
    spacing = 4
    square_side = unit - spacing

    tm_helper = tm_h(
      unit: unit
      spacing: spacing
      square_side: square_side
    )
    
    dur = (3/8) * step # duration of transitions
    del = (3/8) * step # delay before transitions

    middle_x = w / 2

    last_index = 0
    moved = false

    center_square_nw_corner = 
      x: middle_x - (square_side / 2)
      y: spacing

    triangle = [
      { x: square_side / 2, y: 0 },
      { x: 0 - spacing, y: square_side },
      { x: unit, y: square_side }
    ]

    small_triangle = [
      { x: square_side / 2, y: 0 },
      { x: 0, y: square_side },
      { x: square_side, y: square_side }
    ]

    setup_tape = (tape) ->
      {leftTape: left, curr: curr, rightTape: right, index: index} = tape
      
      if index > last_index
        moved =
          tapeToTheLeft: true
      else if index < last_index
        moved =
          tapeToTheLeft: false
      else
        moved = false

      last_index = index
      
      num_ls = Math.ceil((center_square_nw_corner.x / unit) + 1) 
      num_rs = Math.ceil(((w - (center_square_nw_corner.x + unit)) / unit) + 1)
      num_extra_ls = num_ls - left.length
      num_extra_rs = num_rs - right.length
      num_extra_rs = 0 if num_extra_rs < 0
      num_extra_ls = 0 if num_extra_ls < 0
      ls = left[..].concat(new TM.Symbol.B() for n in _.range(0,num_extra_ls))
      rs = right[..].concat(new TM.Symbol.B() for n in _.range(0,num_extra_rs))

      sliced_ls = ls.slice(0, num_ls - 1)
      sliced_rs = rs.slice(0, num_rs - 1)

      for square, i in sliced_ls
        square.num = index - (i + 1)
        square.offset = 0 - (i + 1)

      for square, i in sliced_rs
        square.num = index + (i + 1)
        square.offset = 0 + (i + 1)

      curr.num = index
      curr.offset = 0

      sliced_ls.reverse()
      { tape: sliced_ls.concat(curr).concat(sliced_rs), moved: moved }
        
    () -> 

      canvas = d3_helper.create_canvas(w, h)
      canvas.style("background-color", 'black')
      container = canvas.append("svg:g").classed("container", true)
      container.append("svg:g").classed("tape", true)
      container.append("svg:g").classed("head", true)
      container.append("svg:g").classed("rules", true)

      sq_translation = (offset) ->
        d3_helper.transforms.translation(offset * unit + center_square_nw_corner.x, center_square_nw_corner.y)

      # starting location from which to slide into view
      adjust_enter = (offset) ->
        if moved?
          if moved.tapeToTheLeft then offset + 1 else offset - 1
        else offset

      # offstage location from which to exit
      adjust_exit = (offset) ->
        if moved?
          if moved.tapeToTheLeft then offset - 1 else offset + 1
        else offset
      
      tape_square = (g) ->
        g.append("svg:rect")
         .attr("width", square_side)
         .attr("height", square_side)
         .attr("fill", 'white')

      tape_square_symbol = (g, symbol) ->
        g.append("svg:text")
         .attr("y", square_side - spacing)
         .attr("x", spacing)
         .attr("fill", 'orange')
         .text(symbol)

      # version used in drawing rules
      tape_square_symbol_write = (g, symbol) ->
        g.append("svg:text")
         .attr("y", square_side - spacing)
         .attr("x", spacing)
         .attr("fill", 'lightcoral')
         .text(symbol)
        
      # version used in drawing rules
      machine_head_small = (g, state) ->
        g.append("svg:polygon")
         .attr("points", d3_helper.polygon(small_triangle))
         .attr("fill", 'aquamarine')
        g.append("svg:text")
         .attr("y", square_side - spacing)
         .attr("x", square_side / 2 - spacing - 3)
         .attr("fill", 'darkmagenta')
         .text(state)
        
      machine_head = (g, state) ->
        g.append("svg:polygon")
         .attr("points", d3_helper.polygon(triangle))
         .attr("fill", 'aquamarine')
        g.append("svg:text")
         .attr("y", square_side - spacing)
         .attr("x", square_side / 2 - spacing - 1)
         .attr("fill", 'darkmagenta')
         .text(state)

      # draws appropriate graphic for each type of action
      rule_action = (g) ->
        g.append("svg:polygon")
         .attr("points", (d) ->
          tm_helper.action_spec(d).polygon.points)
         .attr("fill", (d) ->
          tm_helper.action_spec(d).polygon.fill)
         .attr("visibility", (d) ->
          tm_helper.action_spec(d).polygon.visibility)

        g.append("svg:text")
         .attr("x", (d) ->
          tm_helper.action_spec(d).text.x)
         .attr("y", (d) ->
          tm_helper.action_spec(d).text.y)
         .attr("fill", (d) ->
          tm_helper.action_spec(d).text.fill)
         .text((d) ->
          tm_helper.action_spec(d).text.text)
         .attr("visibility", (d) ->
          tm_helper.action_spec(d).text.visibility)

      draw_rules = (program) ->
        rules = tm_helper.setup_rules(program)
        rules_g = container.select("g.rules")
        rule = rules_g.selectAll("g.rule").data(rules)
        rule_e = rule.enter()
          .append("svg:g")
          .classed("rule", true)
          .attr("transform", (d, i) ->
            d3_helper.transforms.translation(spacing, (2 * unit) * (i + 1)))
            
        # state
        state_e = rule_e
          .append("svg:g")
          .classed("state", true)
          .attr("transform", d3_helper.transforms.translation(0, unit))
        machine_head_small(state_e, (d) ->
          d.state.show())

        # symbol
        symbol_e = rule_e
          .append("svg:g")
          .classed("symbol", true)
          .attr("transform", d3_helper.transforms.translation(0, spacing))
        tape_square(symbol_e)
        tape_square_symbol(symbol_e, (d) ->
          if d.symbol.blank() then "" else d.symbol.show())

        # delta.action 
        action_e = rule_e
          .append("svg:g")
          .classed("action", true)
          .attr("transform", d3_helper.transforms.translation(unit, spacing))
        rule_action(action_e)          

        # delta.nextState
        nextState_e = rule_e
          .append("svg:g")
          .classed("next_state", true)
          .attr("transform", d3_helper.transforms.translation(unit, unit))
        machine_head_small(nextState_e, (d) ->
          d.delta.nextState.show())

      # main function for displaying a tape
      draw_tape = (tape, noTransition) ->
        tape_g = container.select("g.tape")
        prepped_tape = setup_tape(tape).tape
        square = tape_g.selectAll("g.square").data(prepped_tape, (d) -> d.num)

        # The current selection 
        square
          .select("text")
          .text((d) -> if d.blank() then "" else d.show())

        square
          .transition()
          .delay(del)
          .duration(dur)
          .attr("transform", (d) ->
            sq_translation(d.offset))

        # The entering selection
        square_e = square.enter()
          .append("svg:g")
          .classed("square", true)

        tape_square(square_e)
        tape_square_symbol(square_e, (d) ->
          if d.blank() then "" else d.show())

        if noTransition?
          square_e
            .attr("transform", (d) ->
              sq_translation(d.offset))
        else 
          square_e
            .attr("transform", (d) ->
              sq_translation(adjust_enter(d.offset)))
            .transition()
            .delay(del)
            .duration(dur)
            .attr("transform", (d) ->
              sq_translation(d.offset))
        
        # The exiting selection
        square.exit()
          .transition()
          .delay(del)
          .duration(dur)
          .attr("transform", (d) ->
            sq_translation(adjust_exit(d.offset)))
          .remove()

      # setup head initially
      initialize_head = (state) ->
        head_g = container.select("g.head")
        head_y = center_square_nw_corner.y + unit
        head_x = center_square_nw_corner.x
        head_g.attr("transform", d3_helper.transforms.translation(head_x,head_y))
        machine_head(head_g, state.show())

      # update state of head
      draw_head = (state) ->
        container.select("g.head")
          .select("text")
          .text(state.show())

      # drawing function
      draw_turing_machine = (tm, noTransition) ->
        draw_tape(tm.tape, noTransition)
        draw_head(tm.state)
        draw_rules(tm.program)

      # body of the page
      tm = tm_helper.tm
      
      initialize_head(tm.state)
      draw_turing_machine(tm,true)

      stepper = () ->
        if not tm.halted()
          tm.step()
          draw_turing_machine(tm)

      setInterval(stepper, step)
)