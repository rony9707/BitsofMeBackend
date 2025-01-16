const ImageKit = require("imagekit");
require('dotenv').config()


publicKey = process.env.imagekit_publicKey;
privateKey = process.env.imagekit_privateKey;
urlEndpoint = process.env.imagekit_urlEndpoint;



const imagekit = new ImageKit({
    publicKey: publicKey,
    privateKey: privateKey,
    urlEndpoint: urlEndpoint
});

const fs = require("fs");

imagekit.upload({
    file: fs.readFileSync("image.jpg"), // Can be a local file path or a URL
    fileName: "example-image.jpg",
    folder: "/ProfilePic" // Optional: specify a folder
}, function(error, result) {
    if (error) {
        console.error("Error uploading file:", error);
    } else {
        console.log("File uploaded successfully:", result);
    }
});
