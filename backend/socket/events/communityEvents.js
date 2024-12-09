const Community = require('../../models/Community');
const Message = require('../../models/Message');

module.exports = (socket, io) => {
  // Join a community
  socket.on('joinCommunity', async ({ communityId, societyId }) => {
    try {
      const community = await Community.findById(communityId);

      if (!community || community.societyId.toString() !== societyId) {
        return socket.emit('error', 'Invalid community or society');
      }

      socket.join(communityId);
      console.log(`User ${socket.id} joined community ${communityId}`);
    } catch (error) {
      console.error('Error joining community:', error.message);
    }
  });

  // Send a message to a community
  socket.on('sendCommunityMessage', async ({ communityId, senderId, text, mediaUrl }) => {
    try {
      const community = await Community.findById(communityId);
      if (!community) {
        return socket.emit('error', 'Invalid community');
      }

      const message = new Message({
        community: communityId,
        sender: senderId,
        text,
        mediaUrl,
      });

      await message.save();

      // Broadcast the message to all users in the community
      io.to(communityId).emit('newCommunityMessage', message);
    } catch (error) {
      console.error('Error sending community message:', error.message);
    }
  });
};