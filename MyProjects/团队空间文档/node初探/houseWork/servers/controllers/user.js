import { Promise } from 'mongoose';

const fs = require('fs.promised');
const User = require('../../dataBase/userDBC');
const Hw = require('../../dataBase/hwDBC');
const Work = require('../../dataBase/workDBC');

var user = async (ctx, next) => {
    ctx.response.type = 'html';
    ctx.response.body = await fs.readFile('./servers/views/user.html', 'utf8');
};

// 获取用户信息
var getUserMes = async (ctx, next) => {
    const query = ctx.request.query;
    var user = await User.findUser(query.id),
        result = {
            success: true,
            code: -1,
            data: { username: '', ownHws: [], workers: [] }
        };

    if (user) {
        result.code = 1000;
        result.data.username = user.username;
        result.data.ownHws = await Hw.getHwsByUser(user._id);
        result.data.workers = user.workWith ? user.workWith.split(',') : [];
    } else {
        result.code = 1001;
    }
    ctx.response.type = 'json';
    ctx.response.body = result;
};

// 添加家务
var addHw = async (ctx, next) => {
    const body = ctx.request.body;
    var result = { success: true, code: -1, message: '', data: {} };
    try {
        var hw = await Hw.addHw({
            name: body.name,
            score: body.score,
            userId: body.id
        });
    } catch (e) {
        result.message = '添加失败';
    }

    if (hw && hw._id) {
        result.data = hw;
        result.code = 1000;
        result.message = '添加家务成功！';
    }
    ctx.response.type = 'json';
    ctx.response.body = result;
};

// 添加家务记录
var addWork = async (ctx, next) => {
    const body = ctx.request.body;
    var result = { success: true, code: -1, message: '', data: {} },
        timeStamp = new Date().getTime();

    try {
        var hw = await Work.addWorks({
            userId: body.userId,
            hwId: body.hwId,
            state: 1,
            doTime: timeStamp,
            launchTime: timeStamp,
            passTime: timeStamp
        });
    } catch (e) {
        console.log('添加家务记录失败：' + JSON.stringify(e));
        result.message = '添加失败';
    }

    if (hw && hw._id) {
        var temp_hw = await Hw.findHw(hw.hwId);
        // 加这句才能修改hw
        hw = hw.toObject();
        hw.name = temp_hw.name;
        result.data = hw;
        result.code = 1000;
        result.message = '添加家务成功！';
    }
    ctx.response.type = 'json';
    ctx.response.body = result;
};

// 获取工作记录
var getWorks = async (ctx, next) => {
    const query = ctx.request.query;
    var works = await Work.findWorksByUserId(query.id),
        result = {
            success: true,
            code: -1,
            data: { works: [] }
        },
        hwsGetName = [],
        temp_promise;

    if (works) {
        // 根据家务id，获取家务名
        for (var i = 0, length = works.length; i < length; i++) {
            temp_promise = getHwName(works[i]);
            hwsGetName.push(temp_promise);
        }

        await Promise.all(hwsGetName).then(
            value => {
                result.code = 1000;
                result.data.works = works;
            },
            result => {
                console.log('result:' + JSON.stringify(result));
                result.message = '添加记录失败！';
            }
        );
    }

    ctx.response.type = 'json';
    ctx.response.body = result;
};

// 获取家务名，返回一个promise
var getHwName = function(item) {
    return new Promise((resolve, reject) => {
        Hw.findHw(item.hwId).then(
            value => {
                item.name = value.name;
                resolve();
            },
            result => {
                reject(result);
            }
        );
    });
};

module.exports = {
    'GET /user': user,
    'GET /user/getUserMes': getUserMes,
    'POST /user/addHw': addHw,
    'POST /user/addWork': addWork,
    'GET /user/getWorks': getWorks
};
