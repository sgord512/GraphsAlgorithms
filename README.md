So this project is basically a bunch of algorithms implemented in Javascript and animated b/c animated algorithms are so much easier to understand than textual descriptions. 

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

Thoughts on Organization:

Basically, I want each edge/vertex to refer back to its graph, which I
currently do by having the Edge prototype have an attribute graph,
which I assign early on. The problem is, then all edges necessarily
have the same graph attribute, and if I want to have multiple graphs,
then I don't know how to have some edges have one graph, and others
have others.

