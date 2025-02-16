const { parentPort, workerData } = require('worker_threads');
const processImageTowebp = require('../common/processImageTowebp');

(async () => {
  try {
    const { buffer, postsSaveFolderPath, originalname, originalUrl, ip } = workerData;
    const fileBuffer = Buffer.from(buffer); // Convert back to Buffer
    

    // Process image
    const { webpFilename_original, ImageFileID} = await processImageTowebp(
      fileBuffer,  // Use converted buffer
      postsSaveFolderPath,
      originalname,
      originalUrl,
      ip
    );
    

    // Send result back to main thread
    parentPort.postMessage({ success: true, filename: webpFilename_original,imageID:ImageFileID });

  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
})();
