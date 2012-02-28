var connect = require('connect')
   ,http = require('http');

var app = connect()
    .use(connect.static(__dirname))
    .use(connect.logger('dev'))
    .use(function(req, res) {
        res.end("No content here. Sorry.\n");
    });

http.createServer(app).listen(8080);
    

                       