var port = process.env.PORT || 3000;

var pages = {
    'huffman': { name: 'huffman', path: 'lib/visualizations/huffman_visualization' }
    ,'mst': { name: 'mst', path: 'lib/visualizations/mst_visualization' }
    ,'tree': { name: 'tree', path: 'lib/visualizations/tree_visualization' }
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

crossroads.bypassed.add(function(request, response) { response.end("Nothing to see here. Sorry!"); });

var js_server = new node_static.Server();

crossroads.addRoute("/js/:module*:", function(request, response, module) {
    console.log(module);
    js_server.serve(request, response);
});

crossroads.addRoute("/{page}", function(request, response, page) { 
    console.log("Sending " + page + " along the wire!!");
    response.end(template({ 'title': page, 'page': pages[page] }));

});

handlebars.registerHelper('run_page_script', function(page) {
    return new handlebars.SafeString(
        '<script type="text/javascript">require([\'' + page.path + '\'], function(' + page.name + ') { $(document).ready(' + page.name + '); });</script>'
    );
});

var index = fs.readFileSync('index.html', 'utf8');
var template = handlebars.compile(index);

var server = http.createServer(function(request, response) {
    var req = url.parse(request.url);
    crossroads.parse(req.pathname,[request, response]); 
});

server.listen(port);

console.log("Listening on port " + port);
    

                       