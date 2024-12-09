const bcrypt = require('bcryptjs')
const SecurityGuard = require('../models/SecurityGuardModel');
const cloudinary = require('cloudinary').v2;

const nodemailer = require('nodemailer');


// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



// Function to generate a random 6-digit password
const generateRandomPassword = () => Math.floor(100000 + Math.random() * 900000).toString();

// Add a new security guard
exports.addSecurityGuard = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, shift, shiftDate, shiftTime, gender } = req.body;

    // Check if the security guard with this email already exists
    const existingGuard = await SecurityGuard.findOne({ email });
    if (existingGuard) {
      return res.status(400).json({ message: 'A security guard with this email already exists.' });
    }

    // Hash the password (you can use a random password or provide one)
    const password = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const files = req.files || {};

    // Handle profile photo and Aadhaar card image
    let profilePhoto = files.profilePhoto?.[0]?.path || req.body.profilePhoto;
    let aadhaarCardImage = files.aadhaarCardImage?.[0]?.path || req.body.aadhaarCardImage;

    // Check required fields
    if (!profilePhoto || !aadhaarCardImage) {
      return res.status(400).json({ message: "Profile photo and Aadhaar card image are required." });
    }

    const newSecurityGuard = new SecurityGuard({
      fullName,
      email, // Make sure email is provided and is unique
      password: hashedPassword, // Store the hashed password
      profilePhoto,
      phoneNumber,
      shift,
      shiftDate,
      shiftTime,
      gender,
      aadhaarCardImage,
      societyId: req.user.society._id,
      adminId: req.user._id
    });

    // Save the new security guard
    await newSecurityGuard.save();
    
    // Send a welcome email to the newly registered security guard
    // You can set up an actual SMTP service here to send the email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to the Security Team',
      text: `Your account has been created. Your password is: ${password}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json({
      message: 'Security Guard added successfully',
      securityGuard: newSecurityGuard
    });

  } catch (error) {
    res.status(500).json({ message: 'Error adding security guard', error: error.message });
  }
};


// Update security guard details
exports.updateSecurityGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber, shift, shiftDate, shiftTime, gender } = req.body;

    // Ensure the security guard exists before updating
    const securityGuard = await SecurityGuard.findById(id);
    if (!securityGuard) {
      return res.status(404).json({ message: 'Security Guard not found' });
    }

    // Prepare updated data
    const updatedData = { fullName, phoneNumber, shift, shiftDate, shiftTime, gender };

    // Check and update profile photo from req.files or req.body
    if (req.files?.profilePhoto?.[0]?.path) {
      updatedData.profilePhoto = (await cloudinary.uploader.upload(req.files.profilePhoto[0].path)).secure_url;
      console.log(updatedData.profilePhoto);
    } else if (req.body.profilePhoto) {
      updatedData.profilePhoto = req.body.profilePhoto; // Assuming URL is passed directly
    }

    // Check and update Aadhaar card image from req.files or req.body
    if (req.files?.aadhaarCardImage?.[0]?.path) {
      updatedData.aadhaarCardImage = (await cloudinary.uploader.upload(req.files.aadhaarCardImage[0].path)).secure_url;
    } else if (req.body.aadhaarCardImage) {
      updatedData.aadhaarCardImage = req.body.aadhaarCardImage; // Assuming URL is passed directly
    }

    // Update the security guard details
    const updatedSecurityGuard = await SecurityGuard.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

    res.json({
      message: 'Security Guard updated successfully',
      securityGuard: updatedSecurityGuard,
    });
  } catch (error) {
    console.error('Error updating security guard:', error);
    res.status(500).json({
      message: 'Error updating security guard',
      error: error.message,
    });
  }
};


// View a security guard's details
exports.viewSecurityGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const securityGuard = await SecurityGuard.findById(id);

    if (!securityGuard) {
      return res.status(404).json({ message: 'Security Guard not found' });
    }

    res.json(securityGuard);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching security guard', error: error.message });
  }
};

// Delete a security guard
exports.deleteSecurityGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const securityGuard = await SecurityGuard.findByIdAndDelete(id);

    if (!securityGuard) {
      return res.status(404).json({ message: 'Security Guard not found' });
    }

    res.json({ message: 'Security Guard deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting security guard', error: error.message });
  }
};

// List all security guards for a society
exports.listSecurityGuards = async (req, res) => {
  try {
    const { society } = req.user;
    const securityGuards = await SecurityGuard.find({ societyId: society });

    res.json(securityGuards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching security guards', error: error.message });
  }
};