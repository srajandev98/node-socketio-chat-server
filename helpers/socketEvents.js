const socketIOActions = require('../actions/socketio');

class SocketEvents {
    constructor() {
        this.socketIOActions = socketIOActions;
    }

    JOIN_ROOM(socket, data) {
        socket.join(data.room._id, async () => {
            /** Get list of messages to send back to client */
            socket.emit(
                'updateRoomData',
                JSON.stringify({
                    messages: await this.socketIOActions.GET_MESSAGES(data),
                    room: await this.socketIOActions.UPDATE_SPACE_USERS(data)
                })
            );

            /** Get Room to update user list for all other clients */
            socket.broadcast
                .to(data.room._id)
                .emit(
                    'updateUserList',
                    JSON.stringify(await this.socketIOActions.GET_SPACE_USERS(data))
                );

            /** Emit event to all clients in the roomlist view except the sender */
            socket.broadcast.emit(
                'updateRooms',
                JSON.stringify({
                    room: await this.socketIOActions.GET_SPACES()
                })
            );

            /** Emit back the message */
            socket.broadcast.to(data.room._id).emit(
                'receivedNewMessage',
                JSON.stringify(
                    await this.socketIOActions.ADD_MESSAGE({
                        room: data.room,
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
