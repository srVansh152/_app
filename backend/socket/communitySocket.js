const CommunityMessage = require('../models/Community');
const Community = require('../models/Community');

// Socket handler for community discussions
exports.communitySocketHandler = (io, socket) => {
  console.log('Community socket initialized');

  // Join a community discussion
  socket.on('joinCommunity', ({ communityId, userId }) => {
    console.log(`User ${userId} joined community ${communityId}`);
    socket.join(communityId);
  });

  // Send a message to a community discussion
  socket.on('sendCommunityMessage', async ({ communityId, senderId, text, mediaUrl }) => {
    try {
      const message = new CommunityMessage({ communityId, sender: senderId, text, mediaUrl });
      await message.save();

      // Emit the message to all participants in the community
      io.to(communityId).emit('newCommunityMessage', message);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { error: 'Failed to send message' });
    }
  });

  // Disconnect user from the community
  socket.on('leaveCommunity', ({ communityId, userId }) => {
    console.log(`User ${userId} left community ${communityId}`);
    socket.leave(communityId);
  });
};