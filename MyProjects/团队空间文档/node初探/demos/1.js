const http = require('http');

http
    .createServer(function(request, response) {
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write('Hello World 1.js');
        response.end();
    })
    .listen(3030);

console.log('Server has started.');
