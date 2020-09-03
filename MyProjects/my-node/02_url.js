const url = require('url');
const http = require('http');
var tools = require('./03_tool-add.js')

http.createServer((req,res)=>{
    res.writeHead(200,{"Content-type": "text/html;chartset=UTF-8"});
    if(req.url != '/favicon.ico') {
        console.log(url.parse(req.url,true).query)
        console.log(url.resolve(req.url,'写文崇'))
        console.log(tools.add(1, 2, 3));
    }
    res.end();
}).listen(3001);