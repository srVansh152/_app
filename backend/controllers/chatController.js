const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Get all chats for a user
exports.getChats = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'name email photo')
      .populate({
        path: 'messages',
        options: { sort: { createdAt: -1 }, limit: 1 }
      });
    res.status(200).json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

// Create or Open a Chat
exports.createChat = async (req, res) => {
  try {
    const { participantId } = req.body;
    const currentUserId = req.user._id; // From auth middleware

    if (!participantId) {
      return res.status(400).json({ error: 'Participant ID is required' });
    }

    // Check if chat already exists between these users
    let chat = await Chat.findOne({
      participants: {
        $all: [currentUserId, participantId],
        $size: 2
      }
    });

    // If no chat exists, create a new one
    if (!chat) {
      chat = new Chat({
        participants: [currentUserId, participantId],
        messages: []
      });
      await chat.save();
    }

    // Populate participant details
    await chat.populate('participants', 'name email photo');

    res.status(200).json(chat);
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

// Send a Message
exports.sendMessage = async (req, res) => {
  try {
    const { text, type } = req.body;
    const chatId = req.params.chatId;
    const senderId = req.user._id;

    console.log('Creating message with data:', { text, chatId, senderId });

    // Create and save the message
    const message = await Message.create({
      chat: chatId,
      text: text,
      sender: senderId,
      type: type || 'text'
    });

    // Populate the sender details
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email photo');

    // Get the chat to find all participants
    const chat = await Chat.findById(chatId)
      .populate('participants', '_id');

    // Emit the message to all participants via socket
    const io = req.app.get('io');
    if (io) {
      chat.participants.forEach(participant => {
        io.to(participant._id.toString()).emit('newMessage', {
          _id: populatedMessage._id,
          chat: chatId,
          text: populatedMessage.text,
          sender: populatedMessage.sender,
          createdAt: populatedMessage.createdAt
        });
      });
    }

    // Update chat's messages array
    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id }
    });

    return res.status(200).json(populatedMessage);

  } catch (error) {
    console.error('Error in sendMessage:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get messages for a specific chat
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Verify user is participant in chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found or unauthorized' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'fullName email photo')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};