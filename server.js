// Setting up port for server, and configuring requirejs
var port = process.env.PORT || 3000;
var requirejs = require('requirejs');
requirejs.config({
    nodeRequire: require,    
    paths: { 'coffee-script' : 'js/deps/coffee-script',
             'cs' : 'js/cs'
           }

});

// Requiring necessary libraries
var fs = require('fs');
var url = require('url');
var http = require('http');
var node_static = require('node-static');
var handlebars = require('handlebars');
var crossroads = require('crossroads');
var winston = require('winston');
var u = require('underscore');

var log_levels = { 
    levels: {
        info: 0,
        page: 1,
        note: 1,
        module: 2,
        css: 3
    },
    colors: {
        info: 'red',
        page: 'yellow',
        note: 'cyan',
        module: 'green',
        css: 'blue'
    }
}
 
// Creating logger
var logger = new winston.Logger({ levels: log_levels.levels, transports: [ new winston.transports.Console({ level: 'info', colorize: true, timestamp: true }) ] });
winston.addColors(log_levels.colors);

// The sitemap is contained in 'config.json' which gets parsed into the pages variable
var pages = JSON.parse(fs.readFileSync('config.json', 'utf8'));
var links = u.map(pages, function(v, k) { 
    return u.extend(v, { destination: k });
});

crossroads.bypassed.add(function(request, response) { response.end("Nothing to see here. Sorry!"); });

// Server used for serving of js modules and css, and other static assets
var js_server = new node_static.Server('.', { cache: 0 });

var index = fs.readFileSync('index.handlebars', 'utf8');
var index_template = handlebars.compile(index);


// These routes are used for everything but the index
crossroads.addRoute("", function(request, response) {
    response.end(index_template({ 'title': "Spencer Gordon's Homepage",
                                  pages: u.values(links) }));
});


crossroads.addRoute("/js/{module*}", function(request, response, module) {
    logger.module(module);
    js_server.serve(request, response);
});

crossroads.addRoute(/^\/([a-z]+\.css)/, function(request, response, css) {
    logger.css("CSS file: " + css);
    js_server.serve(request, response);
});

crossroads.addRoute("/notes/{note}", function(request, response, note) {
    logger.note("Note: " + note);
    js_server.serve(request, response, function (e, res) {
        if (e && (e.status === 404)) { // If the file wasn't found
            js_server.serveFile('/not-found.html', 404, {}, request, response);
        }
    });
});

crossroads.addRoute("/{page}", function(request, response, page) { 
    logger.page("Sending " + page + " along the wire!!");
    response.end(page_template({ 'title': page, 'page': pages[page] }));
});

// JQuery wrapper for the various visualization pages
handlebars.registerHelper('run_page_script', function(page) {
    return new handlebars.SafeString(
        '<script type="text/javascript">require([\''
            + (page.coffee ? "cs!" : "")
            + page.path
            + '\'], function('
            + page.destination
            + ') { $(document).ready('
            + page.destination + '); });</script>'
    );
});

// Page template
var page = fs.readFileSync('page.handlebars', 'utf8');
var page_template = handlebars.compile(page);

var note = fs.readFileSync('note.handlebars', 'utf8');
var note_template = handlebars.compile(page);

// The server used for dynamic content
var server = http.createServer(function(request, response) {
    var req = url.parse(request.url);
    crossroads.parse(req.pathname,[request, response]); 
});

server.listen(port);

logger.info("Listening on port " + port);
