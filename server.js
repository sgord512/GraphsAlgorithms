var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require 
});

var pattern = /\w+\.html/

var port = process.env.PORT || 3000;
var url = require('url');
var connect = require('connect')
   ,http = require('http');

var app = connect()
    .use(connect.favicon())
    .use(connect.logger('short'))
    .use(connect.compress())
//    .use(connect.static(__dirname))
    .use(function(req, res) {
        console.log(url.parse(req.url))
        res.end("No content here. Sorry.\n");
    });

http.createServer(app).listen(port);

console.log("Listening on port " + port);
    

                       