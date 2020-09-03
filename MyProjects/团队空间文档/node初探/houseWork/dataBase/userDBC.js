const User = require('./hwModels').User;

module.exports = {
    getUsers() {
        return User.find({})
            .sort({ _id: -1 })
            .exec();
    },
    findUserByName(username) {
        return User.findOne({ username: username }).exec();
    },
    findUser(id) {
        return User.findById(id).exec();
    },
    editUser(id, data) {
        return User.findByIdAndUpdate(id, data).exec();
    },
    addUser(user) {
        return User.create(user);
    },
    delUser(id) {
        return User.findByIdAndRemove(id).exec();
    }
};
