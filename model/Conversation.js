const mongoose = require('mongoose');


const ConversationSchema = new mongoose.Schema({
    members: {
        type: [
            {
                id: Number,
                companyId: Number,
                email: String,
                mobile: String,
                name: String,
                companyName: String,
                companyNameAr: String
            }
        ],
    }

},
    { timestamps: true }
)


module.exports = mongoose.model('Conversation', ConversationSchema);