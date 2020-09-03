const querystring = require('querystring'),
    fs = require('fs'),
    formidable = require('formidable');

function index(response) {
    fs.readFile('./modules/index.html', function(error, file) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(file.toString());
        response.end();
    });
}

function start(response) {
    var body =
        '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; ' +
        'charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<p>hello in start</p>';
    '</body>' + '</html>';

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(body);
    response.end();
}

exports.index = index;
exports.start = start;
