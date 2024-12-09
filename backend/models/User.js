const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true }, // Optional for phone number login
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  society: { type: mongoose.Schema.Types.ObjectId, ref: 'Society',required: true,  },
  password: { type: String, required: [true, 'Password is required'] },
  userPhoto: { type: String }, // Store the file path or URL for the profile photo  
  role: { 
    type: String, 
    enum: ['residents', 'admin', 'security'], 
    default: 'admin'  // Default role is 'user'
  },

  // OTP fields for password reset
  resetOtp: String,
  otpExpires: Date,
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// Compare the provided password with the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
