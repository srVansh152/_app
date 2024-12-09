const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who created the poll
  society: { type: mongoose.Schema.Types.ObjectId, ref: "Society", required: true }, // Associated society
  type: { type: String, enum: ["MultiChoice", "Ranking", "Rating", "Numeric", "Text"], required: true }, // Poll type
  question: { type: String, required: true },
  options: [{ type: String }], // For multiple-choice, ranking, or rating
  responses: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      response: { type: mongoose.Schema.Types.Mixed } // Could store text, rating, or choice(s)
    }
  ],
  status: { type: String, enum: ["Live", "Closed"], default: "Live" },
  createdAt: { type: Date, default: Date.now },
  endsAt: { type: Date, required: true }, // Poll expiration date
});

module.exports = mongoose.model("Poll", pollSchema);