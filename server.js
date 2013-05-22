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
var yaml = require('js-yaml');

var log_levels = {
    levels: {
        info: 0,
        page: 1,
        note: 1,
        blog_post: 1,
        module: 2,
        css: 3
    },
    colors: {
        info: 'red',
        page: 'yellow',
        note: 'cyan',
        blog_post: 'magenta',
        module: 'green',
        css: 'blue'
    }
};

// Creating logger
var logger = new winston.Logger({
    levels: log_levels.levels,
    transports: [ new winston.transports.Console({ level: 'info', colorize: true, timestamp: true }) ]
});
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

var blog_directory = fs.readFileSync('blog_directory.handlebars', 'utf8');
var blog_directory_template = handlebars.compile(blog);

var blog = fs.readFileSync('blog.handlebars', 'utf8');
var blog_template = handlebars.compile(blog);

var post_dirs = u.reject(fs.readdirSync('blog'), function(str) { return str === "drafts"; });
var post_list = {};
u.each(post_dirs, function(year) {
    var post_months = fs.readdirSync('blog/' + year);
    u.each(post_months, function(month) {
        var post_month_list = fs.readdirSync('blog/' + year + '/' + month);
        u.each(post_month_list, function(post) {
            var link = year + "/" + month + "/" + post;
            var post_obj = yaml.load(fs.readFileSync('blog/' + year + '/' + month + '/' + post), true);
            post_list.push({ link: link,
                             year: year,
                             month: month,
                             post_name: post_obj.Title
            });
        });
    });
});

console.log(post_list);

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

crossroads.addRoute("/blog", function(request, response) {
    logger.blog("Blog directory page");
    response.end(blog_directory_template({ posts: post_list }));
});

crossroads.addRoute(/blog\/[0-9]{4}\/[0-9][0-9]?\/{post}.post/, function(request, response, year, month, title) {
    logger.blog_post(blog_post);
    js_server.serve(request, response);
});

crossroads.addRoute("/notes/{note}", function(request, response, note) {
    logger.note(note);
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
