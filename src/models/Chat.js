const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", ChatSchema);
