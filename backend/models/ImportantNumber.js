const mongoose = require('mongoose');

const importantNumberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the contact name'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide the phone number'],
  },
  work: {
    type: String,
    required: [true, 'Please specify the type of work or job'],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  society: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Society',
    required: true,
  },
}, {
  timestamps: true,
});

const ImportantNumber = mongoose.model('ImportantNumber', importantNumberSchema);

module.exports = ImportantNumber;
