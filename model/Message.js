const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

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
    },
    companyId: {
        type: Number
    }


},
    { timestamps: true }
)

MessageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Message', MessageSchema);