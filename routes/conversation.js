const express = require("express");
const router = express.Router();
const Conversation = require("../model/Conversation");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const Message = require("../model/Message");

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

router.get("/compnaies-orders-conversations", auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      "members.id": req.user.sub,
    });

    let userConversationsCompanies = new Set();

    for (let conversation of conversations) {

      const messages = await Message.find({
        conversationId: conversation._id,
        contentType: 'order'
      });

      if (messages.length > 0) {
        conversation.members.filter(x => x.companyId != req.user.comp).forEach(member => {
          userConversationsCompanies.add({
            companyId: member.companyId,
            companyName: member.companyName,
            companyNameAr: member.companyNameAr
          })
        });
      }
    }

    res.status(200).json(Array.from(userConversationsCompanies));
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
