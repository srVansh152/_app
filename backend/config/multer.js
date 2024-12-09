const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig');

// Set up Cloudinary storage with dynamic folder paths based on field names
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderName;
    switch (file.fieldname) {
      case 'photo':
        folderName = 'resident/photos';
        break;
      case 'aadhaarFront':
        folderName = 'resident/aadhaarFront';
        break;
      case 'aadhaarBack':
        folderName = 'resident/aadhaarBack';
        break;
      case 'addressProof':
        folderName = 'resident/addressProof';
        break;
      case 'rentAgreement':
        folderName = 'resident/rentAgreements';
        break;
      case 'userPhoto':
        folderName = 'user/userPhoto';
        break;
      case 'profilePhoto': // For security guard profile photos
        folderName = 'securityGuard/profilephoto';
        break;
      case 'aadhaarCardImage': // For security guard Aadhaar card images
        folderName = 'securityGuard/aadhaarCardImages';
        break;
      default:
        folderName = 'misc';
    }
    return {
      folder: folderName,
      format: 'jpg', // Or adjust to match the file type
      public_id: `${file.fieldname}-${Date.now()}`, // Customize file naming if needed
    };
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage: storage });

module.exports = upload;
