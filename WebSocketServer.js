const { logger } = require('./config/logModule');
const SocketEvents = require('./helpers/socketEvents');
const SocketIOActions = require('./events/SocketIO');

class WebSocketServer {
    constructor(userTypings = {}) {
        this.userTypings = userTypings;
        this.socketEvents = SocketEvents;
        this.socketIOActions = SocketIOActions;
    }

    init(io) {
        io.on('connection', socket => {
            logger.info('User Connected!', socket.id);
            console.log(socket.id);
            let currentSpaceId = null;

            /** Socket Events */
            socket.on('disconnect', async () => {
                logger.info('User Disconnected!');

                if (currentSpaceId) {
                    /** Filter through users and remove user from user list in that space */
                    const spaceState = await this.socketIOActions.FILTER_SPACE_USERS({
                        spaceId: currentSpaceId,
                        socketId: socket.id
                    });

                    socket.broadcast.to(currentSpaceId).emit(
                        'updateUserList',
                        JSON.stringify(
                            await this.socketIOActions.GET_SPACE_USERS({
                                space: {
                                    _id: mongoose.Types.ObjectId(currentSpaceId)
                                }
                            })
                        )
                    );

                    socket.broadcast.emit(
                        'updateSpaces',
                        JSON.stringify({
                            space: await this.socketIOActions.GET_SPACES()
                        })
                    );

                    socket.broadcast.to(currentSpaceId).emit(
                        'receivedNewMessage',
                        JSON.stringify(
                            await this.socketIOActions.ADD_MESSAGE({
                                space: { _id: spaceState.previous._id },
                                user: null,
                                content: this.socketIOActions.CREATE_MESSAGE_CONTENT(
                                    spaceState,
                                    socket.id
                                ),
                                admin: true
                            })
                        )
                    );
                }
            });

            /** Join User in Space */
            socket.on('userJoined', data => {
                currentSpaceId = data.space._id;
                data.socketId = socket.id;
                this.socketEvents.JOIN_SPACE(socket, data);
            });

            /** User Exit Space */
            socket.on('exitSpace', data => {
                currentSpaceId = null;
                socket.leave(data.space._id, async () => {
                    socket.to(data.space._id).emit(
                        'updateSpaceData',
                        JSON.stringify({
                            space: data.space
                        })
                    );

                    /** Update space list count */
                    socket.broadcast.emit(
                        'updateSpaces',
                        JSON.stringify({
                            space: await this.socketIOActions.GET_SPACES()
                        })
                    );

                    io.to(data.space._id).emit('receivedUserExit', data.space);

                    /** Send Exit Message back to space */
                    socket.broadcast
                        .to(data.space._id)
                        .emit(
                            'receivedNewMessage',
                            JSON.stringify(await this.socketIOActions.ADD_MESSAGE(data))
                        );
                });
            });

            /** User Typing Events */
            socket.on('userTyping', data => {
                if (!userTypings[data.space._id]) {
                    userTypings[data.space._id] = [];
                } else {
                    if (!userTypings[data.space._id].includes(data.user.handle)) {
                        userTypings[data.space._id].push(data.user.handle);
                    }
                }

                socket.broadcast
                    .to(data.space._id)
                    .emit('receivedUserTyping', JSON.stringify(userTypings[data.space._id]));
            });

            socket.on('removeUserTyping', data => {
                if (userTypings[data.space._id]) {
                    if (userTypings[data.space._id].includes(data.user.handle)) {
                        userTypings[data.space._id] = userTypings[data.space._id].filter(
                            handle => handle !== data.user.handle
                        );
                    }
                }

                socket.broadcast
                    .to(data.space._id)
                    .emit('receivedUserTyping', JSON.stringify(userTypings[data.space._id]));
            });

            /** New Message Event */
            socket.on('newMessage', async data => {
                const newMessage = await this.socketIOActions.ADD_MESSAGE(data);

                // Emit data back to the client for display
                io.to(data.space._id).emit('receivedNewMessage', JSON.stringify(newMessage));
            });

            /** Space Deleted Event */
            socket.on('spaceDeleted', async data => {
                io.to(data.space._id).emit('receivedNewMessage', JSON.stringify(data));
                io.to(data.space._id).emit('spaceDeleted', JSON.stringify(data));
                io.emit('spaceListUpdated', JSON.stringify(data));
            });

            /** Space Added Event */
            socket.on('spaceAdded', async data => {
                io.emit('spaceAdded', JSON.stringify(data));
            });

            /** Space Updated Event */
            socket.on('spaceUpdateEvent', async data => {
                io.in(data.space._id).emit('spaceUpdated', JSON.stringify(data));
                io.emit('spaceNameUpdated', JSON.stringify(data));
            });

            /** Reconnected: Update Reconnected User in Space */
            socket.on('reconnectUser', data => {
                currentSpaceId = data.space._id;
                data.socketId = socket.id;
                if (socket.request.headers.referer.split('/').includes('space')) {
                    socket.join(currentSpaceId, async () => {
                        socket.emit('reconnected');
                        await this.socketIOActions.UPDATE_SPACE_USERS(data);
                    });
                }
            });
        });
    }
}

module.exports = WebSocketServer;
