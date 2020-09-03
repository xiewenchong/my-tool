const fs = require('fs.promised');
const User = require('../../dataBase/userDBC');

var index = async (ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = await fs.readFile('./servers/views/index.html', 'utf8');
};

var login = async (ctx, next) => {
    const query = ctx.request.query;
    var user = await User.findUserByName(query.username),
        result = {
            success: true,
            data: { login: false, userId: '' }
        };

    if (user && user.password && user.password === query.password) {
        result.data.login = true;
        result.data.userId = user._id;
    }
    ctx.response.type = 'json';
    ctx.response.body = result;
};

var register = async (ctx, next) => {
    const body = ctx.request.body;
    var user = await User.addUser({
            username: body.username,
            password: body.password,
            nikeName: body.username,
            workWith: ''
        }),
        result = {
            success: true,
            data: { userId: '' }
        };

    if (user && user._id) {
        result.data.userId = user._id;
        result.data.nikeName = user.nikeName;
    }
    ctx.response.type = 'json';
    ctx.response.body = result;
};

var getUsers = async (ctx, next) => {
    var users = await User.getUsers();
    ctx.response.type = 'json';
    ctx.response.body = { user: users };
};

module.exports = {
    'GET /': index,
    'GET /index/login': login,
    'POST /index/register': register
};
