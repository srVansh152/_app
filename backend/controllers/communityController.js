const Community = require('../models/Community');
const Message = require('../models/Message');

// Create community
exports.createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!req.user || !req.user.society || !req.user._id) {
      return res.status(400).json({ error: 'User or society information is missing' });
    }

    const community = new Community({
      name,
      description,
      members: [req.user._id], // Add the creator as the first member
      societyId: req.user.society._id, // Extract from authenticated user
      adminId: req.user._id,           // Extract from authenticated user
    });

    await community.save();
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create community' });
  }
};

// Join a community
exports.joinCommunity = async (req, res) => {
  try {
    const { communityId } = req.params; // Get communityId from URL

    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ error: 'Community not found' });

    // Check if the user belongs to the same society
    if (!community.societyId.equals(req.user.society._id)) {
      return res.status(403).json({ error: 'You cannot join this community' });
    }

    // Add the user if not already a member
    if (!community.members.includes(req.user._id)) {
      community.members.push(req.user._id);
      await community.save();
    }
   
    res.status(200).json({ message: 'Joined community successfully', community });
  } catch (error) {
    res.status(500).json({ error: 'Failed to join community' });
  }
};

// Fetch messages for a community
exports.getCommunityMessages = async (req, res) => {
  try {
    const { communityId } = req.params; // Get communityId from URL

    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ error: 'Community not found' });

    // Check if the user belongs to the same society
    if (!community.societyId.equals(req.user.society._id)) {
      return res.status(403).json({ error: 'You do not have access to this community' });
    }

    const messages = await Message.find({ community: communityId })
      .populate('sender', 'name profilePhoto') // Populate sender details
      .sort({ createdAt: 1 }); // Sort messages in ascending order by date

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Send a message to a community
exports.sendCommunityMessage = async (req, res) => {
  try {
    const { communityId } = req.params; // Get communityId from URL
    const { text, mediaUrl } = req.body; // Extract message details from the body

    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ error: 'Community not found' });

    // Check if the user belongs to the same society
    if (!community.societyId.equals(req.user.society._id)) {
      return res.status(403).json({ error: 'You cannot send messages to this community' });
    }

    const message = new Message({
      community: communityId,
      sender: req.user._id,
      text,
      mediaUrl,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};