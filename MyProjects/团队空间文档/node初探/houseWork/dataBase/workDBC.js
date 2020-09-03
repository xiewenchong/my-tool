const Work = require('./hwModels').Work;

module.exports = {
    getWorks() {
        return Work.find({})
            .sort({ _id: -1 })
            .exec();
    },
    findWorks(id) {
        return Work.findById(id).exec();
    },
    findWorksByUserId(id) {
        return Work.find({ userId: id })
            .sort({ doTime: -1 })
            .lean() // 加这句将Mongooes包装过的对象，转成js对象
            .exec();
    },
    editWorks(id, data) {
        return Work.findByIdAndUpdate(id, data).exec();
    },
    addWorks(user) {
        return Work.create(user);
    },
    delWorks(id) {
        return Work.findByIdAndRemove(id).exec();
    }
};
