const getCurrentDateTime = require('../../common/getCurrentDateTime')
const createTags = require('../../common/createTags')
const fs = require('fs');
const processImageTowebp = require('../../common/processImageTowebp')
const postSchema = require('../../models/post')
const createLogs = require('../../common/createLogs')
const { performance } = require('perf_hooks');


//Declare Env variables here
backendConnectionString = process.env.backendConnectionString

if (!backendConnectionString) {
  createLogs({
    route: "createPosts",
    LogMessage: `Missing required environment variables`,
    originalUrl: 'Error Logs',
    username: 'Error Logs',
    ip: 'Error Logs'
  });
  process.exit(1);
}


exports.createPosts = async (req, res) => {
  try {

    //Folder to save the post Images
    const postsSaveFolderPath = `./uploads/posts/${req.body.username}`;

    //If foldername of that username is not created, then make it
    if (!fs.existsSync(postsSaveFolderPath)) {
      try {
        await fs.promises.mkdir(postsSaveFolderPath, { recursive: true });
        createLogs({
          route: "createPosts",
          LogMessage: `Folder created successfully for storing posts for username ${req.body.username}`,
          originalUrl: req.originalUrl,
          username: req.body.username,
          ip: req.ip
        });
      } catch (err) {
        createLogs({
          route: "createPosts",
          LogMessage: `Failed to create folder for username ${req.body.username}: ${err.message}`,
          originalUrl: req.originalUrl,
          username: req.body.username,
          ip: req.ip
        });
        return res.status(500).json({ message: 'Failed to create folder for storing posts' });
      }
    }


    //Declare the other variables here
    let local_username = req.body.username
    let local_postTopic = req.body.postTopic
    let local_postText = ''
    let local_postVisibility = req.body.visibility;
    let local_postCreationDate = getCurrentDateTime()
    let local_PostModificationDate = getCurrentDateTime()
    let local_tags = []//Create tags to search better
    let local_postEditedStatus = false
    let local_postPics = [];

    //Post Text can be empty, only images
    if (req.body.posttext) {
      local_postText = req.body.posttext
      local_tags = createTags(local_postText)
    }

    //Post Images can be empty, only text
    if (req.files) {
      local_postPics = await processFiles(req.files, postsSaveFolderPath, backendConnectionString, local_username, req);
    }

    const postData = new postSchema({
      db_username: local_username,
      db_postTopic: local_postTopic,
      db_postText: local_postText,
      db_postVisibility: local_postVisibility,
      db_postCreationDate: local_postCreationDate,
      db_postModificationDate: local_PostModificationDate,
      db_tags: local_tags,
      db_postEditedStatus: local_postEditedStatus,
      db_postPics: local_postPics
    });

    // Save the postData to the database
    postData.save()
      .then(result => {
        createLogs({
          route: "createPosts",
          LogMessage: `Post saved successfully for username ${req.body.username}`,
          originalUrl: req.originalUrl,
          username: req.body.username,
          ip: req.ip
        });
        res.json({ message: postData.db_postVisibility === 'public' ? 'Your post has been successfully shared' : 'Your post has been privately saved' });
      })
      .catch(err => {
        createLogs({
          route: "createPosts",
          LogMessage: err.message || 'Unknown error',
          originalUrl: req.originalUrl,
          username: req.body.username,
          ip: req.ip
        });
        res.status(500).json({ message: 'Failed to save post' });
      });

    //console.log(local_postPics)
  }

  catch (err) {
    createLogs({
      route: "createPosts",
      LogMessage: err,
      originalUrl: 'Error Logs',
      username: 'Error Logs',
      ip: 'Error Logs'
    });
    res.status(500).json({ message: err });
  }
};




const processFiles = async (files, postsSaveFolderPath, backendConnectionString, local_username, req) => {
  const local_postPics = [];
  const start = performance.now();
  let countOfImages = 0
  for (const file of files) {
    try {
      const { webpFilename } = await processImageTowebp(
        file.buffer, // Buffer of the current file
        postsSaveFolderPath, // Destination folder path
        file.originalname, // Original filename
        req.originalUrl, // Original request URL
        req.ip // IP address
      );

      let postImages = `${backendConnectionString}/uploads/posts/${local_username}/${webpFilename}`;
      // Push the processed file information to the savedFiles array
      createLogs({
        route: "createPosts",
        LogMessage: `Image saved successfully for ${local_username} in path ${postImages}`,
        originalUrl: req.originalUrl,
        username: req.body.username,
        ip: req.ip
      });
      countOfImages++
      local_postPics.push(postImages);
    } catch (err) {
      createLogs({
        route: "createPosts",
        LogMessage: err,
        originalUrl: 'Error Logs',
        username: 'Error Logs',
        ip: 'Error Logs'
      });
    }
  }

  createLogs({
    route: "createPosts",
    LogMessage: `Total time to convert ${countOfImages} images to webP took ${performance.now() - start}ms`,
    originalUrl: req.originalUrl,
    username: req.body.username,
    ip: req.ip
  });

  return local_postPics;
};



