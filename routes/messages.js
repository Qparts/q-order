const express = require("express");
const router = express.Router();
const Message = require("../model/Message");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:conversationId", auth, async (req, res) => {
  try {
    const count = +req.query.count;
    const page = +req.query.page;

    const messages = await Message.paginate(
      { conversationId: req.params.conversationId },
      {
        page,
        limit: count,
        sort: {
          createdAt: -1, //Sort by Date Added DESC
        },
      }
    );

    const docs = messages.docs.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );

    res.status(200).json(docs);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/unseen", auth, async (req, res) => {
  try {
    const conversations = req.body.conversations;
    const sender = req.body.sender;
    const messages = await Message.find({
      status: "I",
      sender: { $ne: sender },
      conversationId: { $in: conversations },
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/", auth, async (req, res) => {
  try {
    const message = new Message(req.body);
    const updatedMessage = await Message.update({ _id: message._id }, message);
    res.status(200).json(updatedMessage);
  } catch (error) {
    console.log("error", error);
    res.status(500).json(error);
  }
});

router.put("/seen/:conversationId/:sender", auth, async (req, res) => {
  try {
    const updatedConversation = await Message.updateMany(
      {
        conversationId: req.params.conversationId,
        sender: { $ne: req.params.sender },
        status: "I"
      },
      { $set: { status: "S" } }
    );
    res.status(200).json(updatedConversation);
  } catch (error) {
    console.log("error", error);
    res.status(500).json(error);
  }
});

module.exports = router;
