const express = require("express");
const router = express.Router();
const Conversation = require("../model/Conversation");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", auth, async (req, res) => {
  try {
    const newConversation = new Conversation({
      members: req.body.members,
    });
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    console.log("error", error);
    res.status(500).json(error);
  }
});

router.get("/conversations/summary", [auth, admin], async (req, res) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const totalConversations = await Conversation.count(); //total documents
  const todayConversations = await Conversation.find({
    createdAt: { $gte: today },
  }).count();
  const result = { totalConversations, todayConversations };
  return res.status(200).json(result);
});

router.get("/user-conversations", auth, async (req, res) => {
  try {
    const conversation = await Conversation.find({
      "members.id": req.user.sub,
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
