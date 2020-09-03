const server = require('./server');
const router = require('./router');
const requestHandlers = require('./requestHandlers');

var handle = {};
handle['/index'] = requestHandlers.index;
handle['/start'] = requestHandlers.start;

server.start(router.route, handle);
