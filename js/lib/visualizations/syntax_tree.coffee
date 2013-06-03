define(['deps/under',
        'deps/d3',
        'lib/utilities/d3_helper'], (underscore, d3, d3_helper) ->

  _ = underscore._
  d3 = d3

  h = 7/8 * d3_helper.dimensions.y()
  w = 15/16 * d3_helper.dimensions.x()
  unit = 8
  stroke_width = 3
  rounding = 3
  font_size = "10pt"
  font_family = "serif"

  d3.select("#sketchpad")
    .attr("height", h)
    .attr("width", w)
    .style("overflow", "scroll")

  canvas_svg = d3_helper.create_canvas()
  canvas_svg.attr("font-family", font_family)
  canvas_svg.attr("font-size", font_size)
  canvas_defs = canvas_svg.append("defs")
  canvas_defs.append("clipPath")
    .attr("id", "title_clip_path")
    .attr("clipPathUnits", "userSpaceOnUse")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", 3 * unit)
    .attr("width", w)
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("height", 3 * unit)
    .attr("width", w)
  canvas = canvas_svg.append("g").attr("transform", "translate(4 4)")

  

  class Node
    constructor: (@name, @type, @children) ->

  # test_svg = $("<svg id=\"test\"></svg>")
  test_div = d3.select("body").append("div")
  test_div.attr("id","test")
  test_div.style("position", 'absolute')
  test_div.style("visibility", 'hidden')
  test_div.style("height", 'auto')
  test_div.style("width", 'auto')
  test_div.style("font-family", font_family)
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
      colors[type] = d3.hsl(color_set(type)).brighter()
    colors[type]
 
  # I want this to return a height, a width, and the svg group for the child
  blocks = (root, g) ->
    rect = g.append("rect")    
    mask_rect = g.append("rect") if root.children
    block_text = g.append("text")
    [height, width] = min_text_dimensions(root.name)
    min_height = height + unit
    curr_height = min_height
    min_width = width + 2 * unit
    if root.children?
      child_widths = []
      for child in root.children
        child_g = g.append("g")
        child_g.classed("block", true)
        child_g.attr("transform", d3_helper.transforms.translation(unit, curr_height))
        [child_height, child_width, __] = blocks(child, child_g)
        child_widths.push(child_width + 2 * unit)
        curr_height += child_height + unit
        child_widths.push(min_width)
      min_width = _.max(child_widths)
      min_height = curr_height

    text_center = min_width / 2
    rect.attr('stroke', 'black')
      .attr('stroke-width', stroke_width)
      .attr('fill', color_map(root.type))
      .attr('rx', rounding)
      .attr('ry', rounding)
      .attr('width', min_width)
      .attr('height', min_height)
    if root.children
      mask_rect.attr('stroke', 'black')
        .attr('stroke-width', stroke_width)
        .attr('fill', 'black')
        .attr('rx', rounding)
        .attr('ry', rounding)
        .attr('width', min_width)
        .attr('height', min_height)
        .attr('clip-path', 'url(#title_clip_path)')
    block_text
      .attr('fill', if root.children then 'white' else 'black')
      .attr('x', text_center)
      .attr('y', unit)
      .attr('text-anchor', 'middle')
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
    canvas_svg
      .attr("height", height + unit)
      .attr("width", curr_width)

  block = {
    render: render
    Node: Node
  }

  window.block = block
  block

  _n = (args...) ->
    new Node(args...)

  condQ = _n("and", "boolean",
    [_n("collide?", "boolean",
     [_n("world-player", "player",
      [_n("w", "world")])
     ,_n("world-thing1", "thing",
      [_n("w", "world")])])
    ,_n(">", "boolean",
      [_n("player-y", "number",
        [_n("world-player", "player",
          [_n("w", "world")])])
      ,_n("200", "number")])
    ,_n("<", "boolean",
      [_n("player-y", "number",
        [_n("world-player", "player",
          [_n("w", "world")])])
      ,_n("300", "number")])])

  condA = _n("make-world", "world",
    [_n("+", "number",
      [_n("world-score", "number",
        [_n("w", "world")])
      ,_n("10", "number")])
    ,_n("world-timer", "number",
      [_n("w", "world")])
    ,_n("make-player", "player",
      [_n("player-x", "number",
        [_n("world-player", "player",
          [_n("w", "world")])])
      ,_n("200", "number")])
    ,_n("make-thing", "thing",
      [_n("-1000", "number")
      ,_n("0", "number")
      ,_n("0", "number")])
    ,_n("world-thing2", "thing",
      [_n("w", "world")])
    ,_n("world-thing3", "thing",
      [_n("w", "world")])])

  condQ2 = _n("collide?", "boolean",
    [_n("world-player", "player",
      [_n("w", "world")])
    ,_n("world-thing2", "thing",
      [_n("w", "world")])])

  condA2 = _n("make-world", "world",
    [_n("+", "number",
      [_n("world-score", "number",
        [_n("w", "world")])
      ,_n("1", "number")])
    ,_n("world-timer", "number",
      [_n("w", "world")])
    ,_n("update-player", "player",
      [_n("world-player", "player",
        [_n("w", "world")])])
    ,_n("update-thing", "thing",
      [_n("world-thing1", "number",
        [_n("w", "world")])])
    ,_n("make-thing", "thing",
      [_n("-400", "number")
      ,_n("0", "number")
      ,_n("0", "number")])
    ,_n("update-thing", "thing",
      [_n("world-thing3", "number",
        [_n("w", "world")])])])

  condQ3 = _n("<", "boolean",
    [_n("thing-x", "number",
      [_n("world-thing1", "thing",
        [_n("w", "world")])])
    ,_n("0", "number")])
    
  condA3 = _n("make-world", "world",
    [_n("world-score", "number",
      [_n("w", "world")])
    ,_n("-", "number",
      [_n("world-timer", "number",
        [_n("w", "world")])
      ,_n("1", "number")])
    ,_n("update-player", "player",
      [_n("world-player", "player",
        [_n("w", "world")])])
    ,_n("make-thing", "thing",
      [_n("700", "number")
      ,_n("390", "number")
      ,_n("5", "number")])
    ,_n("update-thing", "thing",
      [_n("world-thing2", "number",
        [_n("w", "world")])])
    ,_n("update-thing", "thing",
      [_n("world-thing3", "number",
        [_n("w", "world")])])])
        
  condQ4 = _n("<", "boolean",
    [_n("thing-x", "number",
      [_n("world-thing2", "thing",
        [_n("w", "world")])])
    ,_n("0", "number")])

  condA4 = _n("make-world", "world",
    [_n("world-score", "number",
      [_n("w", "world")])
    ,_n("-", "number",
      [_n("world-timer", "number",
        [_n("w", "world")])
      ,_n("1", "number")])
    ,_n("update-player", "player",
      [_n("world-player", "player",
        [_n("w", "world")])])
    ,_n("update-thing", "thing",
      [_n("world-thing1", "number",
        [_n("w", "world")])])
    ,_n("make-thing", "thing",
      [_n("1500", "number")
      ,_n("200", "number")
      ,_n("5", "number")])
    ,_n("update-thing", "thing",
      [_n("world-thing3", "number",
        [_n("w", "world")])])])

  condQ5 = _n("<", "boolean",
    [_n("thing-x", "number",
      [_n("world-thing3", "thing",
        [_n("w", "world")])])
    ,_n("0", "number")])    
                                    
  condA5 = _n("make-world", "world",
    [_n("world-score", "number",
      [_n("w", "world")])
    ,_n("-", "number",
      [_n("world-timer", "number",
        [_n("w", "world")])
      ,_n("1", "number")])
    ,_n("update-player", "player",
      [_n("world-player", "player",
        [_n("w", "world")])])
    ,_n("update-thing", "thing",
      [_n("world-thing1", "number",
        [_n("w", "world")])])
    ,_n("update-thing", "thing",
      [_n("world-thing2", "number",
        [_n("w", "world")])])
    ,_n("make-thing", "thing",
      [_n("700", "number")
      ,_n("random", "number",
        [_n("200", "number")])
      ,_n("5", "number")])])

  condElse = _n("make-world", "world",
    [_n("world-score", "number",
      [_n("w", "world")])
    ,_n("-", "number",
      [_n("world-timer", "number",
        [_n("w", "world")])
      ,_n("1", "number")])
    ,_n("update-player", "player",
      [_n("world-player", "player",
        [_n("w", "world")])])
    ,_n("update-thing", "thing",
      [_n("world-thing1", "thing",
        [_n("w", "world")])])
    ,_n("update-thing", "thing",
      [_n("world-thing2", "thing",
        [_n("w", "world")])])
    ,_n("update-thing", "thing",
      [_n("world-thing3", "thing",
        [_n("w", "world")])])])

  block.render(_n("cond", "world",
    [condQ, condA
    ,condQ2, condA2
    ,condQ3, condA3
    ,condQ4, condA4
    ,condQ5, condA5
    ,condElse]))

  
)
