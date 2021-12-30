const { logger } = require('../config/logModule');
const SpaceModel = require('../db/models/space.model');
const MessageModel = require('../db/models/message.model');

class SpaceService {
    constructor() {
        this.spaceModel = new SpaceModel();
        this.messageModel = new MessageModel();
    }

    async _fetchMessagesBySpaceId(spaceId) {
        try {
            const messages = await this.messageModel.findRecords({ space: spaceId });
            return messages;
        } catch (err) {
            logger.error('Error Creating Space: %o', err);
            return [];
        }
    }

    async createSpace(req) {
        try {
            // Check if there is space for adminId and userId
            let space = await this.spaceModel.findRecord({
                relationId: req.body.relationId,
                adminId: req.body.adminId,
                users: {
                    $elemMatch: { userId: req.body.userId }
                }
            });

            if (!space) {
                const newSpace = {
                    relationId: req.body.relationId,
                    adminId: req.body.adminId,
                    users: [{ userId: req.body.userId }]
                };
                space = await this.spaceModel.createRecord(newSpace);
            }

            // space = JSON.parse(JSON.stringify(space));
            // const messages = await this._fetchMessagesBySpaceId(space._id);
            // space['messages'] = messages;
            return space;
        } catch (err) {
            logger.error('Error Creating Space: %o', err);
        }
    }

    async getSpacesByAdminId(req) {
        try {
            const adminId = req.params.adminId;
            const resObj = await this.spaceModel.findRecords({ adminId });
            return resObj;
        } catch (err) {
            logger.error('Error Getting Space: %o', err);
        }
    }

    async getSpaceBySpaceId(req) {
        try {
            const spaceId = req.params.spaceId;
            const resObj = await this.spaceModel.findRecordById(spaceId);
            resObj['messages'] = await this._fetchMessagesBySpaceId(spaceId);
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
