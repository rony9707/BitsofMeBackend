const sharp = require('sharp'); // Import sharp for image processing
const path = require('path');
const createLogs = require('../common/createPaperTrailLogs');
const ImageKit = require("imagekit");
require('dotenv').config()


publicKey = process.env.imagekit_publicKey;
privateKey = process.env.imagekit_privateKey;
urlEndpoint = process.env.imagekit_urlEndpoint;

// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: publicKey,
  privateKey: privateKey,
  urlEndpoint: urlEndpoint
});

const processImageTowebp = async (fileBuffer, customDir, filename, originalUrl, ip) => {
  try {
    const baseName = path.basename(filename, path.extname(filename)); // Remove the extension

    // Config for file with resolution 450x450
    const webpFilename = `${Date.now()}-${baseName}.webp`;
    let webpFilename_original = null;
    let webpFilename_100 = null;

    // Convert image to 450x450 WebP format and upload to ImageKit
    const webpBuffer = await sharp(fileBuffer)
      .webp({ quality: 80 }) // Convert to WebP with 80% quality
      .toBuffer(); // Get the processed image as a buffer

    const webpUploadResponse = await imagekit.upload({
      file: webpBuffer, // Buffer of the processed image
      fileName: webpFilename, // Name of the file in ImageKit
      folder: customDir // Specify the folder on ImageKit
    });

    webpFilename_original = webpUploadResponse.url

    // Conditionally create the 100x100 version for users when registering only
    if (originalUrl !== '/post/createpost') {
      const webpFilename_100Temp = `${Date.now()}-${baseName}_100.webp`;

      // Convert image to 100x100 WebP format and upload to ImageKit
      const webpBuffer_100 = await sharp(fileBuffer)
        .resize(100, 100) // Resize to 100x100
        .webp({ quality: 100 }) // Convert to WebP with 100% quality
        .toBuffer();

      const webpUploadResponse_100 = await imagekit.upload({
        file: webpBuffer_100, // Buffer of the processed image
        fileName: webpFilename_100Temp, // Name of the file in ImageKit
        folder: customDir // Specify the folder on ImageKit
      });

      webpFilename_100 = webpUploadResponse_100.url; // Save the URL of the uploaded 100x100 image

      createLogs({
        route: originalUrl,
        LogMessage: "Image is saved to ImageKit as WebP format",
        originalUrl: originalUrl,
        username: filename,
        ip: ip
      });
    }

    return { webpFilename_original, webpFilename_100 };  // Return the WebP 
  } catch (err) {
    createLogs({
      route: "ERROR",
      LogMessage: err.message || 'Unknown error',
      originalUrl: req.originalUrl,
      username: req.body.username,
      ip: req.ip,
      logLevel: 'error'
    });
  }
};

module.exports = processImageTowebp;
