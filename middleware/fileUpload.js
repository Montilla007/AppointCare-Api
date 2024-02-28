const multer = require('multer');

// Define storage settings for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define the destination directory for uploaded files
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Define the filename for uploaded files
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Configure multer middleware
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
}).single('image');

module.exports = upload;
