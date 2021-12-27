const { logger } = require('../config/logModule');
const SpaceModel = require('../db/models/space.model');

class SpaceService {
    constructor() {
        this.spaceModel = new SpaceModel();
    }

    async createSpace(req) {
        try {
            const space = await this.spaceModel.findRecord({
                relationId: req.body.relationId,
                adminId: req.body.adminId,
                userId: req.body.userId
            });

            if (space) {
                throw new Error({ param: 'SPACE_TAKEN', msg: 'Space already taken' });
            } else {
                const newSpace = {
                    relationId: req.body.relationId,
                    adminId: req.body.adminId,
                    userId: req.body.userId
                };

                const resObj = await this.spaceModel.createRecord(newSpace);
                return resObj;
            }
        } catch (err) {
            logger.error('Error Creating Space: %o', err);
        }
    }

    async getSpace(req) {
        try {
            const resObj = await this.spaceModel.findRecords({});
            return resObj;
        } catch (err) {
            logger.error('Error Getting Space: %o', err);
        }
    }

    async getSpaceBySpaceId(req) {
        try {
            const spaceId = req.params.spaceId;
            const resObj = await this.spaceModel.findRecordById(spaceId);
            return resObj;
        } catch (err) {
            logger.error('Error Getting Space by Space Id: %o', err);
        }
    }

    async updateSpace(req) {
        try {
            return;
        } catch (err) {
            logger.error('Error Updating Space: %o', err);
        }
    }
}

module.exports = SpaceService;
