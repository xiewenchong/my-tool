const fs = require('fs');

var getController = function(controllers_dir) {
    var files = fs.readdirSync(__dirname + '/' + controllers_dir);
    var js_files = files.filter(f => {
        return f.endsWith('.js');
    });
    return js_files;
};

var addRouter = function(files, router, controllers_dir) {
    for (var f of files) {
        let mapping = require(__dirname + '/' + controllers_dir + '/' + f);
        for (var url in mapping) {
            if (url.startsWith('GET')) {
                var path = url.substring(4);
                router.get(path, mapping[url]);
            } else if (url.startsWith('POST')) {
                var path = url.substring(5);
                router.post(path, mapping[url]);
            } else {
                console.log(`invalid URL: ${url}`);
            }
        }
    }
};

module.exports = function(dir) {
    let controllers_dir = dir || 'controllers', // 如果不传参数，扫描目录默认为'controllers'
        router = require('koa-router')();

    var files = getController(controllers_dir);
    addRouter(files, router, controllers_dir);
    return router.routes();
};
