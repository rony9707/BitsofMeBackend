const sharp = require('sharp'); // Import sharp for image processing
const path = require('path');
const createLogs = require('../common/createLogs');

const processImageTowebp = async (fileBuffer, customDir, filename, originalUrl, ip) => {
  try {
    // Strip the original extension and append .webp
    const baseName = path.basename(filename, path.extname(filename)); // Remove the extension

    // Config of file with Resolution 450 X 450
    const webpFilename = `${Date.now()}-${baseName}.webp`; // Add the .webp extension
    const filePath = path.join(customDir, webpFilename);

    // Save Resolution 450 X 450
    await sharp(fileBuffer)
      .resize(450, 450) // Resize to 450x450
      .webp({ quality: 80 }) // Convert to WebP with 80% quality
      .toFile(filePath); // Save the image to disk

    let webpFilename_100 = null;

    // Conditionally create the 100 X 100 version for users when registering only
    if (originalUrl !== '/post/createpost') {
      const webpFilename_100Temp = `${Date.now()}-${baseName}_100.webp`; // Add the .webp extension
      const filePath_100 = path.join(customDir, webpFilename_100Temp);

      // Save Resolution 100 X 100
      await sharp(fileBuffer)
        .resize(100, 100) // Resize to 100x100
        .webp({ quality: 100 }) // Convert to WebP with 100% quality
        .toFile(filePath_100); // Save the image to disk

      webpFilename_100 = webpFilename_100Temp;

      createLogs({
        route: "register",
        LogMessage: "Image is saved to as webp format",
        originalUrl: originalUrl,
        username: filename,
        ip: ip
      });
    }



    return { webpFilename, webpFilename_100 }; // Return the WebP filenames
  } catch (err) {
    throw new Error('Error processing the image: ' + err.message);
  }
};

module.exports = processImageTowebp;
