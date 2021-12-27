const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SpaceSchema = new Schema(
    {
        relationId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        adminId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        users: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    required: true
                },
                socketId: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    { timestamps: true }
);

const _Space = mongoose.model('Space', SpaceSchema);

module.exports = { _Space };
