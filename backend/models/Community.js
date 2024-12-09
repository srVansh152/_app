// models/Community.js
const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true }, // Community name
  description: { type: String },         // Short description
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Members in the community
  societyId: { type: mongoose.Schema.Types.ObjectId, ref: 'resident', required: true }, // Associated society
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },     // Admin who created the community
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Community', communitySchema);