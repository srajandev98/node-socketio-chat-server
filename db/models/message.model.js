const { _MessageModel } = require('../schema/message.schema');

class MessageModel {

    constructor() {}

    /**
     * @description This method will help create a Message record
     * 
     * @param {Object} dataObject
     */
    async createRecord(dataObject) {
        try {
            const messageRecord = await _MessageModel.create(dataObject).populate('user');
            return messageRecord;
        } catch(error) {
            throw { error, message: 'Error Creating Message' };
        }
    }

    /**
     * @description This method will help find a Message record
     * 
     * @param {Object} condition
     */
    async findRecord(condition) {
        try {
            const messageRecord = await _MessageModel.findOne(condition).populate('user');
            return messageRecord;
        } catch(error) {
            throw { error, message: 'Error Finding Message' };
        }
    }

    /**
     * @description This method will help find a Message record
     * 
     * @param {Object} condition
     */
     async findRecords(condition) {
        try {
            const messageRecord = await _MessageModel.find(condition).populate('user');
            return messageRecord;
        } catch(error) {
            throw { error, message: 'Error Finding Messages' };
        }
    }

    /**
     * @description This method will help find a Message record
     * 
     * @param {Object} condition
     */
     async findRecordById(_messageId) {
        try {
            const messageRecord = await _MessageModel.findById(_messageId).populate('user');
            return messageRecord;
        } catch(error) {
            throw { error, message: 'Error Finding Message By Id' };
        }
    }

    /**
     * @description This method will help update an Message record
     * 
     * @param {Object} condition
     */
     async updateRecord(_id, data) {
        try {
            const messageRecord = await _MessageModel.findByIdAndUpdate(_id, { ...data }, {new: true}).populate('user');
            return messageRecord;
        } catch(error) {
            throw { error, message: 'Error Updating Message' };
        }
    }

    /**
     * @description This method will help delete an Message record
     * 
     * @param {Object} condition
     */
    //  async deleteRecordById(_id) {
    //     try {
    //         const messageRecord = await _MessageModel.findByIdAndDelete(_id);
    //         return messageRecord;
    //     } catch(error) {
    //         throw { error, message: 'Error Deleting Message' };
    //     }
    // }
}

module.exports = MessageModel;