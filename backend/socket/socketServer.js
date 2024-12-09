const socketIO = require('socket.io');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

let io; // Declare io at the top to make it accessible in getIO

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Track active users
  const activeUsers = new Map(); // userId -> socketId

  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    // Join society room
    socket.on('join-society', (societyId) => {
      socket.join(`society-${societyId}`);
      console.log(`joined society room: society-${societyId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Handle user connection
    socket.on('userConnected', (userId) => {
      console.log('User connected:', userId);
      activeUsers.set(userId, socket.id);
      socket.userId = userId;

      // Broadcast userConnected event to all clients
      io.emit('userConnected', userId);

      // Broadcast updated online users list
      io.emit('activeUsers', Array.from(activeUsers.keys()));
    });

    // Handle joining chat rooms
    socket.on('joinChat', ({ chatId, userId }) => {
      if (!chatId) {
        console.log('joinChat event received without chatId');
        return;
      }

      console.log(`User ${userId} joining chat ${chatId}`);
      socket.join(chatId);
    });

    // Handle new messages
    socket.on('sendMessage', async (messageData) => {
      try {
        const { chatId, text, senderId } = messageData;

        // Create and save message
        const newMessage = new Message({
          chat: chatId,
          sender: senderId,
          text: text,
          type: 'text'
        });
        await newMessage.save();

        // Populate sender details
        const populatedMessage = await Message.findById(newMessage._id)
          .populate('sender', 'fullName email photo');

        // Update chat with new message
        await Chat.findByIdAndUpdate(chatId, {
          $push: { messages: newMessage._id }
        });

        // Broadcast to chat room
        io.to(chatId).emit('newMessage', {
          _id: populatedMessage._id,
          chat: chatId,
          text: populatedMessage.text,
          sender: populatedMessage.sender,
          createdAt: populatedMessage.createdAt
        });

      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('messageError', { error: 'Failed to send message' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      if (socket.userId) {
        activeUsers.delete(socket.userId);

        // Broadcast userDisconnected event to all clients
        io.emit('userDisconnected', socket.userId);

        // Broadcast updated online users list
        io.emit('activeUsers', Array.from(activeUsers.keys()));
      }
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

// Add getIO function
const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized. Please call init() first.");
  }
  return io;
};

module.exports = { initializeSocket, getIO };