const Message = require("../models/Message");
const Chat = require("../models/Chat");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join a chat room
    socket.on("joinChat", async (chatId) => {
      const chatExists = await Chat.findById(chatId);
      if (!chatExists) {
        socket.emit("error", "Chat not found");
        return;
      }

      socket.join(chatId);
      console.log(`📢 User joined chat: ${chatId}`);

      // Send previous messages
      const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
      socket.emit("chatHistory", messages);
    });

    // Listen for new messages
    socket.on("sendMessage", async (data) => {
      const { chatId, user, message } = data;

      if (!chatId || !user || !message) return;

      const newMessage = new Message({ chatId, user, message });
      await newMessage.save();

      io.to(chatId).emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
};
