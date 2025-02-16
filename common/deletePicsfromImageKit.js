const ImageKit = require("imagekit");
require("dotenv").config();


const imagekit = new ImageKit({
    publicKey: process.env.imagekit_publicKey,
    privateKey: process.env.imagekit_privateKey,
    urlEndpoint: process.env.imagekit_urlEndpoint
});

async function deleteImagesFromImageKit(imageIds) {
    try {
        if (!Array.isArray(imageIds) || imageIds.length === 0) {
            throw new Error("Invalid image IDs array");
        }

        const deletePromises = imageIds.map(imageId => 
            imagekit.deleteFile(imageId)
        );
        
        await Promise.all(deletePromises);
        console.log("All images deleted successfully");
    } catch (error) {
        console.error("Error deleting images from ImageKit:", error);
        throw error;
    }
}

module.exports = deleteImagesFromImageKit;
