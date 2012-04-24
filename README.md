So this project is basically a bunch of algorithms implemented in
Javascript and animated b/c animated algorithms are so much easier to
understand than textual descriptions. 

Algorithms in Progress or Complete
==================================
- Prim's Algorithm
- Kruskal's Algorithm
- Huffman Coding
- Edit Distance
- Karger's Min Cut
- Longest Palincomplementary Sequence
- k-th Selection (Randomized / Deterministic Linear Time)
- Hexagonal Tiling
- Viterbi's Algorithm
- Hadamard Matrices
- Wood-Splitting (String-breaking algorithm, don't know the official name)
- Conway's Game of Life Simulation
- Elementary Cellular Automata Simulation

- And a whole bunch more that I haven't documented yet...

- Next commit will have a whole bunch of bookkeeping, and documentation. 
  I have so much implemented by now, that it is becoming increasingly difficult to keep track of what code I have.

- Also, this is OUT-OF-DATE, and so is TODO.md

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
like to make that better. Ideas: 
- do something with the balancing and wieghting of the trees.
- have the connected chunk move together, to make its togetherness evident.

4. I could try animating some data structures.

5. 