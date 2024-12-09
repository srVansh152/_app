const Poll = require("../models/Poll");

// Create a new poll
exports.createPoll = async (req, res) => {
  try {
    const { type, question, options, endsAt } = req.body;
    if (!type || !question || !endsAt) {
      return res.status(400).json({ message: "Type, question, and end date are required." });
    }

    const poll = new Poll({
      creator: req.user._id, // Authenticated user
      society: req.user.society, // Extracted from the logged-in user
      type,
      question,
      options,
      endsAt,
    });

    const savedPoll = await poll.save();
    res.status(201).json({ message: "Poll created successfully", poll: savedPoll });
  } catch (error) {
    res.status(500).json({ message: "Error creating poll", error: error.message });
  }
};

// Get all polls (Own, New, and Previous)
exports.getPolls = async (req, res) => {
  try {
    const { filter } = req.query;

    let query = { society: req.user.society }; // Filter polls by society
    if (filter === "Own") query.creator = req.user._id;
    else if (filter === "New") query.status = "Live";
    else if (filter === "Previous") query.status = "Closed";

    const polls = await Poll.find(query).populate("creator", "name");
    res.status(200).json({ polls });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving polls", error: error.message });
  }
};

// Submit a response to a poll
exports.submitResponse = async (req, res) => {
  try {
    const { pollId, response } = req.body;

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (poll.status === "Closed") {
      return res.status(400).json({ message: "This poll is no longer accepting responses." });
    }

    // Check if the user already submitted a response
    const existingResponse = poll.responses.find((resp) => resp.user.toString() === req.user._id.toString());
    if (existingResponse) {
      return res.status(400).json({ message: "You have already responded to this poll." });
    }

    poll.responses.push({ user: req.user._id, response });
    await poll.save();
    res.status(200).json({ message: "Response submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting response", error: error.message });
  }
};

// Close a poll (only creator can close)
exports.closePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (poll.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to close this poll." });
    }

    poll.status = "Closed";
    await poll.save();
    res.status(200).json({ message: "Poll closed successfully", poll });
  } catch (error) {
    res.status(500).json({ message: "Error closing poll", error: error.message });
  }
};