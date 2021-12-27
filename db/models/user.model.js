const { _UserModel } = require('../schema/user.schema');

class UserModel {

    constructor() {}

    /**
     * @description This method will help create a Message record
     * 
     * @param {Object} dataObject
     */
    async createRecord(dataObject) {
        try {
            const userRecord = await _UserModel.create(dataObject).populate('user users.lookup');
            return userRecord;
        } catch(error) {
            throw { error, user: 'Error Creating Message' };
        }
    }

    /**
     * @description This method will help find a Message record
     * 
     * @param {Object} condition
     */
    async findRecord(condition) {
        try {
            const userRecord = await _UserModel.findOne(condition).populate('user users.lookup');
            return userRecord;
        } catch(error) {
            throw { error, user: 'Error Finding Message' };
        }
    }

    /**
     * @description This method will help find a Message record
     * 
     * @param {Object} condition
     */
     async findRecords(condition) {
        try {
            const userRecord = await _UserModel.find(condition).populate('user users.lookup');
            return userRecord;
        } catch(error) {
            throw { error, user: 'Error Finding Message' };
        }
    }

    /**
     * @description This method will help find a Message record
     * 
     * @param {Object} condition
     */
     async findRecordById(_userId) {
        try {
            const userRecord = await _UserModel.findById(_userId).populate('user users.lookup');
            return userRecord;
        } catch(error) {
            throw { error, user: 'Error Finding Message By Id' };
        }
    }

    /**
     * @description This method will help update an Message record
     * 
     * @param {Object} condition
     */
     async updateRecord(_id, data) {
        try {
            const userRecord = await _UserModel.findByIdAndUpdate(_id, { ...data }, {new: true}).populate('user users.lookup');
            return userRecord;
        } catch(error) {
            throw { error, user: 'Error Updating Message' };
        }
    }

    /**
     * @description This method will help delete an Message record
     * 
     * @param {Object} condition
     */
    //  async deleteRecordById(_id) {
    //     try {
    //         const userRecord = await _UserModel.findByIdAndDelete(_id);
    //         return userRecord;
    //     } catch(error) {
    //         throw { error, user: 'Error Deleting Message' };
    //     }
    // }
}

module.exports = UserModel;
