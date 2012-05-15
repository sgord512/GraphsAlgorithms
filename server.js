var port = process.env.PORT || 3000;

var pages = {
    'huffman': { name: 'huffman',
                 path: 'lib/visualizations/huffman_page',
                 description: "Visualize the creation of a Huffman code from character frequencies."
               }
    ,'mst': { name: 'mst',
              path: 'lib/visualizations/mst_page',
              description: "Side-by-side animations of Prim's and Kruskal's algorithms for building a minimum spanning tree."
            }
    ,'tree': { name: 'tree', 
               path: 'lib/visualizations/tree_page',
               description: "Comparisons of different algorithms for drawing trees."
             }
    ,'life': { name: 'life',
               path: 'lib/visualizations/cellular_automata/life_page',
               description: "Simulation of Conway's Game of Life."
             }
    ,'ca': { name: 'ca',
             path: 'lib/visualizations/cellular_automata/automata_page',
             description: "Simulation of 1d elementary cellular automata."
           }

    ,'hanoi': { name: 'hanoi',
                path: 'lib/visualizations/hanoi_page',
                description: "Animated Towers of Hanoi solver."
              } 

    ,'dihedral': { name: 'dihedral',
               path: 'lib/visualizations/groups/group_page',
               description: "Visualization of the dihedral group of order 8."
             }
/*
    ,'ta_hours': { name: 'ta_hours',
                   path: 'lib/visualizations/ta_hours_visualization',
                   description: "Visualization of the integer programming solution to the TA Hours problem"
                 }
*/
}

var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require 
});

var fs = requirejs('fs');
var url = requirejs('url');
var http = requirejs('http');
var node_static = requirejs('node-static');
var handlebars = requirejs('handlebars');
var crossroads = requirejs('crossroads');
var u = requirejs('underscore');

crossroads.bypassed.add(function(request, response) { response.end("Nothing to see here. Sorry!"); });

var js_server = new node_static.Server('.', { cache: 0 });

var index = fs.readFileSync('index.handlebars', 'utf8');
var index_template = handlebars.compile(index);

crossroads.addRoute("", function(request, response) {
    response.end(index_template({ 'title': 'Visualizations', pages: u.values(pages) }));
});

crossroads.addRoute("/js/{module*}", function(request, response, module) {
    console.log(module);
    js_server.serve(request, response);
});

crossroads.addRoute(/^\/([a-z]+\.css)/, function(request, response, css) {
    console.log("CSS file: " + css);
    js_server.serve(request, response);
});

crossroads.addRoute("/{page}", function(request, response, page) { 
    console.log("Sending " + page + " along the wire!!");
    response.end(page_template({ 'title': page, 'page': pages[page] }));

});

handlebars.registerHelper('run_page_script', function(page) {
    return new handlebars.SafeString(
        '<script type="text/javascript">require([\'' + page.path + '\'], function(' + page.name + ') { $(document).ready(' + page.name + '); });</script>'
    );
});

var page = fs.readFileSync('page.handlebars', 'utf8');
var page_template = handlebars.compile(page);

var server = http.createServer(function(request, response) {
    var req = url.parse(request.url);
    crossroads.parse(req.pathname,[request, response]); 
});

server.listen(port);

console.log("Listening on port " + port);
