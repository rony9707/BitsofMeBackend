const multer = require('multer');

// Set storage engine
const storeImages = () =>{
  return multer.memoryStorage();
}

module.exports = storeImages;