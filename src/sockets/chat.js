const Message = require("../models/Message");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Send chat history on connect
    Message.find()
      .sort({ timestamp: 1 })
      .then((messages) => {
        socket.emit("chatHistory", messages);
      });

    // Listen for new messages via WebSocket
    socket.on("sendMessage", async (data) => {
      const newMessage = new Message({ user: data.user, message: data.message });
      await newMessage.save();

      io.emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};

