// models/Resident.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
    email: String,
    age: Number,
    gender: String,
    relation: String,
});

const vehicleSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    name: String,
    number: String,
});

const residentSchema = new mongoose.Schema({
  photo: { type: String, required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  wing: { type: String, required: true },
  unitNumber: { type: String, required: true },
  relation: { type: String, required: true },
  aadhaarFront: { type: String, required: true },
  aadhaarBack: { type: String, required: true },
  addressProof: { type: String, required: true },
  rentAgreement: { type: String, required: true },
  members: [memberSchema],
  vehicles: [vehicleSchema],
  owner: { type: Boolean, required: true },
  ownerDetails: {
    fullName: { type: String, required: function () { return !this.owner; }},
    phoneNumber: { type: String, required: function () { return !this.owner; }},
    address: { type: String, required: function () { return !this.owner; }},
  },
  role: { type: String, enum: ['resident', 'admin', 'security'], default: 'resident' },
  society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  password: { type: String },
  resetOtp: String,
  otpExpires: Date,
}, { timestamps: true });

residentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

residentSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Resident', residentSchema);
