var port = process.env.PORT || 3000;

var pages = {
    'huffman': { name: 'huffman',
                 path: 'lib/visualizations/huffman_visualization',
                 description: "Visualize the creation of a Huffman code from character frequencies."
               }
    ,'mst': { name: 'mst',
              path: 'lib/visualizations/mst_visualization',
              description: "Side-by-side animations of Prim's and Kruskal's algorithms for building a minimum spanning tree."
            }
    ,'tree': { name: 'tree', 
               path: 'lib/visualizations/tree_visualization',
               description: "Comparisons of different algorithms for drawing trees."
             }
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

var js_server = new node_static.Server();

var index = fs.readFileSync('index.handlebars', 'utf8');
var index_template = handlebars.compile(index);

crossroads.addRoute("", function(request, response) {
    response.end(index_template({ 'title': 'Visualizations', pages: u.values(pages) }));
});

crossroads.addRoute("/js/{module*}", function(request, response, module) {
    console.log(module);
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
