const mongoose = require('mongoose');
const MessageModel = require('../db/models/message.model');
const SpaceModel = require('../db/models/space.model');
const { logger } = require('../config/logModule');

class SocketIOActions {
    constructor() {
        this.messageModel = new MessageModel();
        this.spaceModel = new SpaceModel();
    }

    async ADD_MESSAGE(data) {
        try {
            const message = {
                content: data.content,
                adminId: data.adminId,
                userId: data.userId,
                space: data.spaceId
            };
            const messageRecord = await this.messageModel.createRecord(message);
            return messageRecord;
        } catch (err) {
            logger.error('Failed to Add Message: %s', err);
        }
    }

    async GET_MESSAGES(data) {
        try {
            const spaceId = data.space._id;
            const messageRecords = await this.messageModel.findRecords({ space: spaceId });
            return messageRecords;
        } catch (err) {
            logger.error('Failed to Add Message: %s', err);
        }
    }

    async CREATE_MESSAGE_CONTENT(space, socketId) {
        try {
            // @TODO
        } catch (err) {
            logger.error('Failed to Create Message Content %s', err);
        }
    }

    async GET_SPACES() {
        try {
            const spaceRecords = await this.spaceModel.findRecords({});
            return spaceRecords;
        } catch (err) {
            logger.error('Failed to Create Message Content %s', err);
        }
    }

    async GET_SPACE_USERS(data) {
        try {
            const spaceId = data.space._id;
            const spaceUserRecords = await this.spaceModel.findRecordById(spaceId);
            return spaceUserRecords;
        } catch (err) {
            logger.error('Failed to Get Space Users %s', err);
        }
    }

    async UPDATE_SPACE_USERS(data) {
        try {
            const space = await this.spaceModel.findRecord({ _id: data.space._id });
            if (space) {
                if (
                    space.users &&
                    !space.users.find(user => user.lookup._id.toString() === data.user._id)
                ) {
                    space.users.push({
                        lookup: mongoose.Types.ObjectId(data.user._id),
                        socketId: data.socketId
                    });
                    const updatedRoom = await space.save();
                    return await Space.populate(updatedRoom, {
                        path: 'user users.lookup',
                        select: 'username social image handle'
                    });
                } else {
                    // Update user socket id if the user already exists
                    const existingUser = space.users.find(
                        user => user.lookup._id.toString() === data.user._id
                    );
                    if (existingUser.socketId != data.socketId) {
                        existingUser.socketId = data.socketId;
                        await space.save();
                    }
                    return await Room.populate(space, {
                        path: 'user users.lookup',
                        select: 'username social image handle'
                    });
                }
            } else {
                return;
            }
        } catch (err) {
            logger.error('Failed to Update Space Users %s', err);
        }
    }

    async FILTER_SPACE_USERS(data) {
        try {
            const space = await this.spaceModel.findRecordById(
                mongoose.Types.ObjectId(data.spaceId)
            );
            if (space) {
                let previousUserState = Object.assign({}, space._doc);
                space.users = space.users.filter(user => user.socketId !== data.socketId);
                const updatedRoom = await space.save();
                return {
                    previous: previousUserState,
                    updated: await Room.populate(updatedRoom, {
                        path: 'user users.lookup',
                        select: 'username social image handle'
                    })
                };
            }
        } catch (err) {
            logger.error('Failed to Filter Space Users %s', err);
        }
    }
}

module.exports = SocketIOActions;
