var static_server = require('node-static');

var file =  new static_server.Server();

require('http').createServer(function (request, response) {
    request.addListener('end', function() {
        file.serve(request,response);
    });
}).listen(8080);
                       