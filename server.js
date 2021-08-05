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


mongoose.connect(`mongodb://${process.env.MONGODB_HOST}/chat`)
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