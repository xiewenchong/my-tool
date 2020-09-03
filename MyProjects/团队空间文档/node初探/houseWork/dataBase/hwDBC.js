const Hw = require('./hwModels').Hw;

module.exports = {
    getHws() {
        return Hw.find({})
            .sort({ _id: -1 })
            .exec();
    },
    getHwsByUser(id) {
        return Hw.find({ userId: id }).exec();
    },
    findHw(id) {
        return Hw.findById(id).exec();
    },
    editHw(id, data) {
        return Hw.findByIdAndUpdate(id, data).exec();
    },
    addHw(hw) {
        return Hw.create(hw);
    },
    delHw(id) {
        return Hw.findByIdAndRemove(id).exec();
    }
};
