const express = require("express");
const cors = require("cors");
const app = express();
const evn = require("dotenv");
const mongoose = require('mongoose');

const conversationRoutes = require('./routes/conversation');
const messageRoutes = require('./routes/messages');


evn.config();

app.use(express.json());
app.use(cors());

const db_connection_Url = process.env.MONGODB_HOST == 'localhost' ? `mongodb://${process.env.MONGODB_HOST}/${process.env.MONGODB_CHAT_DB}` :
    `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_CHAT_DB}`


mongoose.connect(db_connection_Url, { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB....'))
    .catch(err => console.log('Could not connect to MongoDB...', err));

app.use('/conversation', conversationRoutes);
app.use('/messages', messageRoutes);





app.get("/", (req, res) => {
    res.send("hello world!");
});

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
    console.log(`app started on port ${PORT}`)
});