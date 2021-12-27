const socketIOActions = require('../events/SocketIO');

class SocketEvents {
    constructor() {
        this.socketIOActions = socketIOActions;
    }

    JOIN_SPACE(socket, data) {
        socket.join(data.space._id, async () => {
            /** Get list of messages to send back to client */
            socket.emit(
                'updateSpaceData',
                JSON.stringify({
                    messages: await this.socketIOActions.GET_MESSAGES(data),
                    space: await this.socketIOActions.UPDATE_SPACE_USERS(data)
                })
            );

            /** Get Space to update user list for all other clients */
            socket.broadcast
                .to(data.space._id)
                .emit(
                    'updateUserList',
                    JSON.stringify(await this.socketIOActions.GET_SPACE_USERS(data))
                );

            /** Emit event to all clients in the spacelist view except the sender */
            socket.broadcast.emit(
                'updateSpaces',
                JSON.stringify({
                    space: await this.socketIOActions.GET_SPACES()
                })
            );

            /** Emit back the message */
            socket.broadcast.to(data.space._id).emit(
                'receivedNewMessage',
                JSON.stringify(
                    await this.socketIOActions.ADD_MESSAGE({
                        space: data.space,
                        user: false,
                        content: data.content,
                        admin: data.admin
                    })
                )
            );
        });
    }
}

module.exports = SocketEvents;
