const mongoose = require('mongoose');


const MessageSchema = new mongoose.Schema({

    conversationId: {
        type: String,
    },

    sender: {
        type: String,
    },

    text: {
        type: String,
    },

    contentType: {
        type: String,
    },
    status: {
        type: String,
        default: 'I'
    }


},
    { timestamps: true }
)


module.exports = mongoose.model('Message', MessageSchema);