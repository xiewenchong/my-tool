const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/hello');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('connected in');
});

const HelloSchema = mongoose.Schema({
    hello: 'String'
});
var Hello = mongoose.model('Hello', HelloSchema);
Hello.create({ hello: 'world3.js', aa: 'sss' });
