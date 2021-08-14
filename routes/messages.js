const express = require("express");
const router = express.Router();
const Message = require('../model/Message');


router.post('/', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);

    } catch (error) {
        res.status(500).json(error);
    }
});


router.get('/:conversationId', async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        });
        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json(error);
    }
});


router.post('/unseen', async (req, res) => {
    try {
        const conversations = req.body.conversations;
        const sender = req.body.sender;
        const messages = await Message.find({
            status: 'I',
            sender: { $ne: sender },
            conversationId: { $in: conversations }
        });
        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json(error);
    }
});

router.put('/', async (req, res) => {
    try {
        const message = new Message(req.body);
        const updatedMessage = await Message.update({ _id: message._id }, message);
        res.status(200).json(updatedMessage);
    } catch (error) {
        console.log("error", error);
        res.status(500).json(error);
    }
});

router.put('/seen/:conversationId/:sender', async (req, res) => {
    try {
        const updatedConversation = await Message.updateMany(
            { conversationId: req.params.conversationId, sender: { $ne:  req.params.sender } },
            { $set: { status: 'S' } }
        );
        res.status(200).json(updatedConversation);
    } catch (error) {
        console.log("error", error);
        res.status(500).json(error);
    }
});

module.exports = router;
