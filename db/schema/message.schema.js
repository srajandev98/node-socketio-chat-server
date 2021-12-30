const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
    {
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
        }
    },
    { timestamps: true }
);

const _Message = mongoose.model('Message', MessageSchema);

module.exports = { _Message };
