So this project is basically a bunch of algorithms implemented in
Javascript and animated b/c animated algorithms are so much easier to
understand than textual descriptions. 

Algorithms in Progress or Complete
==================================
- Prim's Algorithm
- Kruskal's Algorithm
- Huffman Coding

TODO
----

1. Figure out some way of randomly generating attractive graphs, so
that I don't have to have incredibly ugly graphs, and I don't have to
hand-make some, which would suck. Here are my thoughts on that at that
moment: Maybe I could generate points so that each new point is either
below or to the right of the previous point, and then connect that to
previous points only, which I think with some fiddling could be
employed to generate close-to-planar graphs. Also, maybe I can have
some stock graph connected-components that I can randomly
arrange. Some system where I replace each vertex with an entire graph,
in some fractal way. Then again, I'm probably way overthinking this.

2. So I've got like 80% of an animation for Huffman Coding done, but I
am currently having trouble figuring out how I want to do the layout
for subtrees. The difficulty is figuring out how to dynamically
accomadating different branching shapes. Here's an idea: Basically
have every layer below the root layer be subdivided the same number of
times by default, and whenever conflicts occur, have the conflicting
nodes duel it out.

3. Ok, so I got Huffman coding working, but it ain't pretty. I would
like to make that better.
