const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Society = require('../models/Society');
const Resident = require('../models/Resident');
const SecurityGuard = require('../models/SecurityGuardModel');

const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify token and extract user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    let user;
    let role;

    // Check if the user is an admin in the User model
    user = await User.findById(userId).select('-password').populate('society');
    if (user) {
      role = user.role; // Assume admin role is stored in User schema
    } else {
      // Check if the user is a resident in the Resident model
      user = await Resident.findById(userId).populate('society createdBy');
      if (user) {
        role = 'resident';
        req.adminId = user.createdBy?._id; // Attach admin ID for residents
      } else {
        // Check if the user is a security guard in the SecurityGuard model
        user = await SecurityGuard.findById(userId).populate('societyId');
        if (user) {
          role = 'security';
          req.adminId = user.adminId; // Attach admin ID for security guards
        } else {
          // If the user is not found in any collection
          return res.status(401).json({ message: 'Not authorized, user not found' });
        }
      }
    }

    // Attach user and role to request object
    req.user = user;
    req.userRole = role;

    // Handle society-specific data for non-security roles
    if (role !== 'security') {
      if (user.society || user.societyId) {
        const society = await Society.findById(user.society || user.societyId).populate('residents');
        req.residents = society?.residents || [];
        req.user.society = society; // Attach full society object
      } else {
        req.residents = [];
      }
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error('Error in protect middleware:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
  }
};

// Middleware to restrict access to specific roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = { protect, restrictTo };