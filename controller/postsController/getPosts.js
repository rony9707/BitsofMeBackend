

const postSchema = require('../../models/post')
// http://localhost:4000/post/getPosts?limit=5&page=1&db_postTopic=games&tags=oisfndoasdfoaisfdasd&db_postVisibility=private

backendConnectionString = process.env.backendConnectionString


if (!backendConnectionString) {

  process.exit(1);
}


exports.getPosts = async (req, res) => {
  try {
    // Extract `limit`, `page`, `db_postTopic`, `tags`, and `db_postVisibility` parameters from the query string
    const limit = parseInt(req.query.limit, 10) || 10; // Default limit: 10
    const page = parseInt(req.query.page, 10) || 1;   // Default page: 1
    const db_postTopic = req.query.db_postTopic || null; // Default: null (fetch all posts)
    const tags = req.query.tags ? req.query.tags.split(',') : null; // Split tags into an array if provided
    const db_postVisibility = req.query.db_postVisibility || null; // Default: null (fetch all visibility)


    console.log(`Requested URL: ${req.originalUrl}`);
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Build the query object
    const query = {};
    if (db_postTopic) query.db_postTopic = db_postTopic;
    if (tags) query.db_tags = { $all: tags }; // Ensure all specified tags are present
    if (db_postVisibility) query.db_postVisibility = db_postVisibility;

    // Fetch posts sorted by `db_postCreationDate` (latest first) with pagination
    const posts = await postSchema.find(query)
      .sort({ db_postCreationDate: -1 }) // Sort by latest `db_postCreationDate`
      .skip(skip)
      .limit(limit);

    // Add a dynamic postID to each post
    const response = posts.map((post, index) => {
      const { __v, db_postEditedStatus, ...filteredPost } = post.toObject(); // Exclude unwanted fields
      return {
        postID: skip + index + 1,
        ...filteredPost,
      };
    });
    // Send the response
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
  }
};