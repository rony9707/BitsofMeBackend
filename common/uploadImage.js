const multer = require('multer');
const path = require('path');
const storeImages = require('../common/storeImage')

// Initialize Multer
const upload = (customDir) => {
 return multer({
    storage: storeImages(customDir), 
    fileFilter: (req, file, cb) => {
      // Allow only images
      const fileTypes = /jpeg|jpg|png|webp/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
  
      if (extname && mimetype) {
        cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    }
  });
}


module.exports = upload;