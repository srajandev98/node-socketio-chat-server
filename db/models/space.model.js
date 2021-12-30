const { _Space } = require('../schema/space.schema');

class SpaceModel {

    constructor() {}

    /**
     * @description This method will help create a Message record
     * 
     * @param {Object} dataObject
     */
    async createRecord(dataObject) {
        try {
            const spaceRecord = await _Space.create(dataObject);
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
            const spaceRecord = await _Space.findOne(condition);
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
            const spaceRecord = await _Space.find(condition);
            return spaceRecord;
        } catch(error) {
            console.log(error);
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
            const spaceRecord = await _Space.findById(_spaceId);
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
            const spaceRecord = await _Space.findByIdAndUpdate(_id, { ...data }, {new: true});
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
    //         const spaceRecord = await _Space.findByIdAndDelete(_id);
    //         return spaceRecord;
    //     } catch(error) {
    //         throw { error, space: 'Error Deleting Message' };
    //     }
    // }
}

module.exports = SpaceModel;
