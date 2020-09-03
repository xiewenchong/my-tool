const http = require('http');
const cheerio = require('cheerio');
var url = 'http://www.yaochufa.com/';

var req = http
    .get(url, function(res) {
        var html = '';
        res.on('data', function(data) {
            html += data;
        });
        res.on('end', function() {
            var productDatas = filterProducts(html);
            printProducts(productDatas);
        });
    })
    .on('error', function(e) {
        console.log('错误：' + e.message);
    });

function filterProducts(html) {
    var $ = cheerio.load(html),
        products = $('#J-city-tour .package-mod'),
        result = [];
    products.each(function(index, item) {
        var product = $(this),
            score = $(this)
                .find('.recomm span:last-child em')
                .text()
                .trim()
                .replace('%', ''),
            name = '';
        if (score * 1 > 96) {
            name = $(this)
                .find('.title')
                .text()
                .trim();
            result.push({ name, score });
        }
    });
    return result;
}

function printProducts(productDatas) {
    productDatas.forEach(function(product) {
        console.log(product.name + '  好评率:' + product.score + '%');
        console.log('\n');
    });
}
