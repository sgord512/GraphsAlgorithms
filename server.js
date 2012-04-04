var port = process.env.PORT || 3000;

var pages = {
    'huffman': { name: 'huffman', path: 'lib/visualizations/huffman_visualization' }
    ,'mst': { name: 'mst', path: 'lib/visualizations/mst_visualization' }
            }

var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require 
});

var fs = requirejs('fs');
var url = requirejs('url');
var connect = requirejs('connect')
var http = requirejs('http');
var handlebars = requirejs('handlebars');

handlebars.registerHelper('run_page_script', function(page) {
    return new handlebars.SafeString(
        '<script type="text/javascript">require([\'' + page.path + '\'], function(' + page.name + ') { ' + page.name + '(); });</script>'
    );
});

var index = fs.readFileSync('index.html', 'utf8');
var template = handlebars.compile(index);

var app = connect()
    .use(connect.favicon())
    .use(connect.logger('dev'))
    .use(connect.compress())
    .use('/js', connect.static(__dirname + '/js'))
    .use(connect.staticCache())
    .use(function(req, res) {

        var request = url.parse(req.url);
        res.end(template({ title: request.pathname, page: pages[request.path.slice(1)] }));
    });

http.createServer(app).listen(port);

console.log("Listening on port " + port);
    

                       