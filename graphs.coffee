Edge = (start, end) ->
  if(start < end)
    @start = start
    @end = end
  else if(start > end)
    @start = end
    @end = start
  else
    console.log("Self-loop created!")
    @self_loop = true;
  @index = Edge.next_index()
  @inMST = false;

Edge::start_point = () -> points[@start]
Edge::end_point = () -> points[@end]
Edge::weight = () -> Math.sqrt(Math.pow(@start_point().x - @end_point().x,2) + Math.pow(@start_point().y - @end_point().y,2))
Edge::addToMST = () ->
  console.log(this + " added to MST!")
  @inMST = true

Edge::toString = -> "index: " + @index + ", " + @start + " to " + @end




