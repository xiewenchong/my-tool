let http = require('http')
let items = [{
    name: '阿瑟東'
}]  //數據庫拿到的東西
http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Content-Type', 'application/json')
    switch (req.method) {
        case 'OPTIONS':
            res.statusCode = 200;
            res.end();
            break;
        case 'GET':
            let data = JSON.stringify(items);
            res.write(data);
            res.end();
            break;
        case 'POST':
            let item = '';
            req.on('data',chunk=>{
                item+=chunk;
            });
            req.on('end',()=>{
                console.log(item);
                
                items.push(JSON.parse(item))
                let data = JSON.stringify(items);
                res.write(data);
                res.end();
            })
            break;
    }
}).listen(3000);