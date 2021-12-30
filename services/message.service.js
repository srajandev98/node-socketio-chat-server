const { logger } = require('../config/logModule');
const MessageModel = require('../db/models/message.model');

class MessageService {
    constructor() {
        this.messageModel = new MessageModel();
    }

    async createMessage(req) {
        try {
            console.log(req.data);
            if (!req.body.content) {
                errors.push({
                    param: 'no_content',
                    msg: 'Message cannot be empty'
                });
                return res.json({
                    errors: createErrorObject(errors)
                });
            }

            const message = {
                content: req.body.content,
                userId: req.body.userId,
                space: req.body.space._id
            };

            const resObj = await this.messageModel.createRecord(message);

            return resObj;
        } catch (err) {
            logger.error('Error Creating Message: %o', err);
        }
    }

    async getMessagesBySpaceId(req) {
        try {
            const spaceId = req.params.spaceId;
            const messageRes = await this.messageModel.findRecords({ space: spaceId });
            return messageRes;
        } catch (e) {
            logger.error('Error Getting Message by Space Id: %o', e);
            throw e;
        }
    }
}

module.exports = MessageService;
