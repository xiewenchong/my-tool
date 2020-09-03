const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-type": "text/html;charset=UTF-8"
    })
    res.write("<div>你好</div>")
    res.end('hello');
}).listen(3001);