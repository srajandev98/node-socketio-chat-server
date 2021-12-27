const { _SpaceModel } = require('../schema/space.schema');

class SpaceModel {

    constructor() {}

    /**
     * @description This method will help create a Message record
     * 
     * @param {Object} dataObject
     */
    async createRecord(dataObject) {
        try {
            const spaceRecord = await _SpaceModel.create(dataObject).populate('user users.lookup');
            return spaceRecord;
        } catch(error) {
            throw { error, space: 'Error Creating Message' };
        }
    }

    /**
     * @description This method will help find a Message record
     * 
     * @param {Object} condition
     */
    async findRecord(condition) {
        try {
            const spaceRecord = await _SpaceModel.findOne(condition).populate('user users.lookup');
            return spaceRecord;
        } catch(error) {
            throw { error, space: 'Error Finding Message' };
        }
    }

    /**
     * @description This method will help find a Message record
     * 
     * @param {Object} condition
     */
     async findRecords(condition) {
        try {
            const spaceRecord = await _SpaceModel.find(condition).populate('user users.lookup');
            return spaceRecord;
        } catch(error) {
            throw { error, space: 'Error Finding Message' };
        }
    }

    /**
     * @description This method will help find a Message record
     * 
     * @param {Object} condition
     */
     async findRecordById(_spaceId) {
        try {
            const spaceRecord = await _SpaceModel.findById(_spaceId).populate('user users.lookup');
            return spaceRecord;
        } catch(error) {
            throw { error, space: 'Error Finding Message By Id' };
        }
    }

    /**
     * @description This method will help update an Message record
     * 
     * @param {Object} condition
     */
     async updateRecord(_id, data) {
        try {
            const spaceRecord = await _SpaceModel.findByIdAndUpdate(_id, { ...data }, {new: true}).populate('user users.lookup');
            return spaceRecord;
        } catch(error) {
            throw { error, space: 'Error Updating Message' };
        }
    }

    /**
     * @description This method will help delete an Message record
     * 
     * @param {Object} condition
     */
    //  async deleteRecordById(_id) {
    //     try {
    //         const spaceRecord = await _SpaceModel.findByIdAndDelete(_id);
    //         return spaceRecord;
    //     } catch(error) {
    //         throw { error, space: 'Error Deleting Message' };
    //     }
    // }
}

module.exports = SpaceModel;
