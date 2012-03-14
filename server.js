var port = process.env.PORT || 3000;

var connect = require('connect')
   ,http = require('http');

var app = connect()
    .use(connect.static(__dirname))
    .use(connect.logger('dev'))
    .use(function(req, res) {
        res.end("No content here. Sorry.\n");
    });

http.createServer(app).listen(port);

console.log("listening on port " + port);
    

                       