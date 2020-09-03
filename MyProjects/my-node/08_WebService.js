let fs = require('fs');
let url = require('url')
let http = require('http')
let path = require('path')
// 获取后缀名
getExt = (extName) => {
    let json = fs.readFileSync('./exname.json');
    return JSON.parse(json)[extName];
}
http.createServer((req, res) => {
    let name = req.url;
    if (name == '/') {
        name = 'index.html';
    }
    let extName = path.extname(name);
    if (name != '/favicon.ico') {
        fs.readFile(`./upload/${name}`, (err, file) => {
            if (err) {
                fs.readFile('./upload/404.html', (err, data) => {
                    res.writeHead(200, { 'Content-type': "text/html;charset='UTF-8'" });
                    res.write(data)
                    res.end();
                })
            } else {
                console.log(extName)
                let ext = getExt(extName)
                res.writeHead(200, {'Content-type':`${ext};charset='UTF-8'`});
                res.write(file)
                res.end();
            }
        })
    }
}).listen(3000);
