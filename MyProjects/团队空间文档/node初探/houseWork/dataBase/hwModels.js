const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1:27017/housework');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected in');
});

// 用户表
const userSchema = Schema({
    username: {
        unique: true,
        type: 'String',
        require: true
    },
    password: {
        type: 'String',
        require: true
    },
    nikeName: 'String',
    // 完成家务时，需要其他成员确认
    workWith: {
        type: 'String',
        require: true
    },
    // 添加的家务_id
    works: 'String'
});
// 家务表
const hwSchema = Schema({
    name: {
        type: 'String',
        require: true
    },
    score: {
        type: 'Number',
        require: true,
        default: 1
    },
    // 添加家务的人
    userId: {
        type: 'String',
        require: true
    }
});
// 家务记录表
const workSchema = Schema({
    userId: {
        type: 'String',
        require: true
    },
    hwId: {
        type: 'String',
        require: true
    },
    state: {
        type: 'Number', // 0未审核，1已审核
        require: true
    },
    doTime: {
        type: 'String',
        require: true
    },
    launchTime: {
        type: 'String',
        require: true
    },
    passTime: 'String'
});

// 用户表
exports.User = mongoose.model('User', userSchema);
// 家务表
exports.Hw = mongoose.model('Hw', hwSchema);
// 家务记录表
exports.Work = mongoose.model('Work', workSchema);
