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
                admin: data.admin ? true : false,
                user: data.user ? data.user._id : null,
                room: data.room._id
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
            const spaceUserRecords = await this.spaceModel.findRecordById();
            return spaceUserRecords;
        } catch (err) {
            logger.error('Failed to Get Space Users %s', err);
        }
    }

    async UPDATE_ROOM_USERS(data) {
        const room = await Room.findOne({ name: data.room.name })
            .select('-password')
            .populate('users.lookup', ['username', 'social', 'handle', 'image']);

        if (room) {
            if (
                room.users &&
                !room.users.find(user => user.lookup._id.toString() === data.user._id)
            ) {
                room.users.push({
                    lookup: mongoose.Types.ObjectId(data.user._id),
                    socketId: data.socketId
                });
                const updatedRoom = await room.save();
                return await Room.populate(updatedRoom, {
                    path: 'user users.lookup',
                    select: 'username social image handle'
                });
            } else {
                // Update user socket id if the user already exists
                const existingUser = room.users.find(
                    user => user.lookup._id.toString() === data.user._id
                );
                if (existingUser.socketId != data.socketId) {
                    existingUser.socketId = data.socketId;
                    await room.save();
                }
                return await Room.populate(room, {
                    path: 'user users.lookup',
                    select: 'username social image handle'
                });
            }
        } else {
            return;
        }
    }

    async FILTER_ROOM_USERS(data) {
        const room = await Room.findById(mongoose.Types.ObjectId(data.roomId))
            .select('-password')
            .populate('users.lookup', ['username', 'social', 'handle', 'image']);
        if (room) {
            let previousUserState = Object.assign({}, room._doc);
            room.users = room.users.filter(user => user.socketId !== data.socketId);
            const updatedRoom = await room.save();
            return {
                previous: previousUserState,
                updated: await Room.populate(updatedRoom, {
                    path: 'user users.lookup',
                    select: 'username social image handle'
                })
            };
        }
    }
}

module.exports = SocketIOActions;
