const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        space: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Space'
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true
        },
        admin: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const _Message = mongoose.model('Message', MessageSchema);

module.exports = { _Message };
