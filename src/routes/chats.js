const express = require("express");
const Chat = require("../models/Chat");

const router = express.Router();

// Create a new chat
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Chat name is required" });
    }

    const newChat = new Chat({ name });
    await newChat.save();

    res.status(201).json({ success: true, chat: newChat });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all chats
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chats" });
  }
});

module.exports = router;
