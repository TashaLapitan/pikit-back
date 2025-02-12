const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// GET endpoint to receive a message and store it
router.get("/send", async (req, res) => {
  try {
    const { user, message } = req.query;

    if (!user || !message) {
      return res.status(400).json({ error: "User and message are required" });
    }

    const newMessage = new Message({ user, message });
    await newMessage.save();

    res.status(200).json({ success: true, message: "Message saved!", data: newMessage });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Fetch all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

module.exports = router;

