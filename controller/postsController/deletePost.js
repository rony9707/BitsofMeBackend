const postSchema = require('../../models/post');
const userSchema = require('../../models/user');
const createLogs = require('../../common/createPaperTrailLogs');
const deleteImagesFromImageKit = require('../../common/deletePicsfromImageKit')

exports.deletePost = async (req, res) => {
    try {
        const local_userId = req.user._id;

        // Get the full user from JWT
        const user = await userSchema.findOne({ _id: local_userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Get the full post data from req.body
        const post = await postSchema.findOne({ _id: req.body.postID });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the post belongs to the user
        if (post.db_username !== user.db_username) {
            return res.status(403).json({ message: "Unauthorized: You can't delete this post" });
        }

        //ImageKit Post ID's Delete
        postIDs=post.db_postPicFileIds
        await deleteImagesFromImageKit(postIDs);

        // Delete the post
        await postSchema.deleteOne({ _id: req.body.postID });

        // Log the deletion (if needed)

        return res.status(200).json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error("Error deleting post:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
