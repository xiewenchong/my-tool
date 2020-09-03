const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');
const staticFiles = require('./static-files');

var app = new Koa();

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});
app.use(staticFiles('/static/', __dirname + '/static'));
app.use(bodyParser());
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');
