const express = require("express");
const router = express.Router();
const Conversation = require('../model/Conversation');


router.post('/', async (req, res) => {
    try {
        const newConversation = new Conversation({
            members: req.body.members
        })
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);

    } catch (error) {
        console.log("error", error);
        res.status(500).json(error);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const conversation = await Conversation.find({
            "members.id": req.params.userId
        })
        res.status(200).json(conversation);

    } catch (error) {
        console.log("error", error);
        res.status(500).json(error);
    }
});


module.exports = router;
