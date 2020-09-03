const Koa = require('koa');
const app = new Koa();

const main = ctx,next => {
    ctx.response.type = 'text/plain';
    ctx.response.body = 'Hello World 2.js';
};

app.use(main);
app.listen(3030);
