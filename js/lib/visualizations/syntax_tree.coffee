define(['deps/under',
        'deps/d3',
        'lib/utilities/d3_helper'], (underscore, d3, d3_helper) ->

  _ = underscore._
  d3 = d3

  h = 7/8 * d3_helper.dimensions.y()
  w = 15/16 * d3_helper.dimensions.x()
  unit = 6
  font_size = "10pt"

  canvas = d3_helper.create_canvas(w, h)
  canvas.attr("font-family", "sans-serif")
  canvas.attr("font-size", font_size)
  canvas = canvas.append("g").attr("transform", "translate(4 4)")

  class Node
    constructor: (@name, @type, @children) ->

  # test_svg = $("<svg id=\"test\"></svg>")
  test_div = d3.select("body").append("div")
  test_div.attr("id","test")
  test_div.style("position", 'absolute')
  test_div.style("visibility", 'hidden')
  test_div.style("height", 'auto')
  test_div.style("width", 'auto')
  test_div.style("font-family", "sans-serif")
  test_div.style("font-size", font_size)
  test_text = test_div.append("text")
  
  tt = $("#test > text")

  min_text_dimensions = (text) ->
    test_text.text(text)
    height = ((tt.innerHeight() / unit) + 1) * unit
    width = ((tt.innerWidth() / unit) + 1) * unit
    test_text.text()
    [height, width]

  color_set = d3.scale.category10()
  color_map = (type) ->
    colors = colors or {}
    if not colors[type]?
      colors[type] = color_set(type)
    colors[type]
 
  # I want this to return a height, a width, and the svg group for the child
  blocks = (root, g) ->
    if not root.children?
      [height, width] = min_text_dimensions(root.name)
      height += unit
      width += 2 * unit
      rect = g.append("rect")
      rect.attr('stroke', 'black')
        .attr('stroke-width', 3)
        .attr('fill', color_map(root.type))
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('width', width)
        .attr('height', height)
      block_text = g.append("text")
      block_text
        .attr('x', unit)
        .attr('y', unit)
        .append("tspan")
        .text(root.name)
        .attr("dominant-baseline", "text-before-edge")
      [height, width, g]
    else
      rect = g.append("rect")
      block_text = g.append("text")
      [height, width] = min_text_dimensions(root.name)
      child_widths = []
      min_height = height + unit
      curr_height = min_height
      min_width = width + 2 * unit
      for child in root.children
        child_g = g.append("g")
        child_g.classed("block", true)
        child_g.attr("transform", d3_helper.transforms.translation(unit, curr_height))
        [child_height, child_width, __] = blocks(child, child_g)
        child_widths.push(child_width + 2 * unit)
        curr_height += child_height + unit

      min_height = curr_height
      child_widths.push(min_width)
      min_width = _.max(child_widths)

      rect.attr('stroke', 'black')
        .attr('stroke-width', 3)
        .attr('fill', color_map(root.type))
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('width', min_width)
        .attr('height', min_height)

      block_text
        .attr('x', unit)
        .attr('y', unit)
        .append("tspan")
        .text(root.name)
        .attr("dominant-baseline", "text-before-edge")
      [min_height, min_width, g]

  curr_width = 0

  render = (node) ->
    g = canvas.append("g")
      .classed("block", true)
      .attr("transform", d3_helper.transforms.translation(curr_width, 0))
    [height, width, __] = blocks(node, g)
    curr_width += width + unit

  block = {
    render: render
    Node: Node
  }

  window.block = block
  block

  condQ = new Node("and", "boolean",
    [new Node("collide?", "boolean",
     [new Node("world-player", "player",
      [new Node("w", "world")])
     ,new Node("world-thing1", "thing",
      [new Node("w", "world")])])
    ,new Node(">", "boolean",
      [new Node("player-y", "number",
        [new Node("world-player", "player",
          [new Node("w", "world")])])
      ,new Node("200", "number")])
    ,new Node("<", "boolean",
      [new Node("player-y", "number",
        [new Node("world-player", "player",
          [new Node("w", "world")])])
      ,new Node("300", "number")])])

  condA = new Node("make-world", "world",
    [new Node("+", "number",
      [new Node("world-score", "number",
        [new Node("w", "world")])
      ,new Node("10", "number")])
    ,new Node("world-timer", "number",
      [new Node("w", "world")])
    ,new Node("make-player", "player",
      [new Node("player-x", "number",
        [new Node("world-player", "player",
          [new Node("w", "world")])])
      ,new Node("200", "number")])
    ,new Node("make-thing", "thing",
      [new Node("-1000", "number")
      ,new Node("0", "number")
      ,new Node("0", "number")])
    ,new Node("world-thing2", "thing",
      [new Node("w", "world")])
    ,new Node("world-thing3", "thing",
      [new Node("w", "world")])])
            
  block.render(condQ)
  block.render(condA)
)
