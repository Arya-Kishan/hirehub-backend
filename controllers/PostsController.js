const { Post } = require("../models/PostsModel");
const { getUrl } = require("../Helper/Cloudinary");


exports.getAllPosts = async (req, res) => {

    try {

        let { page } = req.query;

        const doc = await Post.find().populate("userId").populate({
            path: "likes",
            model: 'User',
            select: { '_id': 1, 'name': 1 },
        }).populate({
            path: "comments.userId",
            model: 'User',
            select: { '_id': 1, 'name': 1 },
        }).skip(10 * page).limit(10);

        let totalCount = await Post.find().countDocuments();
        console.log(totalCount);

        res.set("x-total-post", totalCount)

        res.status(200).json(doc);


    } catch (error) {
        console.log(error);
        res.status(400).json({ 'message': 'Error In Getting All Posts' });
    }
}

exports.getUserPostsById = async (req, res) => {
    try {
        const { userId } = req.query;
        const doc = await Post.find({ userId: userId }).populate("userId").populate("likes").populate("comments.userId");
        res.status(200).json(doc);
    } catch (error) {
        console.log(error);
        res.status(400).json({ 'message': 'Error In Getting User Post By Id' });
    }
}

exports.addPost = async (req, res) => {
    try {

        console.log("-------------ADDING POST----------");

        console.log(req.files);

        let picUrl = await getUrl(req.files?.pic)

        const post = new Post({ ...req.body, picUrl: picUrl })
        let newPost = await post.save();
        res.status(200).json(newPost);

    } catch (error) {
        console.log(error);
        res.status(400).json({ data: 'ERROR IN UPLOADING POST', error: error });
    }
}

exports.updatePostById = async (req, res) => {
    try {

        const { postId } = req.query;
        const updatedJob = await Post.findByIdAndUpdate(postId, req.body, { new: true })
        res.status(200).json(updatedJob);

    } catch (error) {
        console.log(error);
        res.status(400).json({ 'message': 'Error In Updating Posts' });
    }
}

exports.deletePostById = async (req, res) => {
    try {

        const { postId } = req.query;
        const updateUser = await Post.findByIdAndDelete(postId)
        res.status(200).json(updateUser);

    } catch (error) {
        console.log(error);
        res.status(400).json({ 'message': 'Error In Deleting Post' });
    }
}

// await Student.updateOne({ _id: 1 }, { $push: { friends: 'Maria' } })
exports.addLikeOrComment = async (req, res) => {
    try {

        const { type, purpose, postId, userId, comment } = req.query;
        console.log("TYPE", type);
        console.log("PURPOSE", purpose);
        console.log("USER_ID", userId);
        console.log("POST_ID", postId);
        console.log("COMMENT", comment);



        if (type == "like" && purpose == "add") {

            const doc = await Post.updateOne({ _id: postId }, { $push: { likes: userId } })
            const newDoc = await Post.findById(postId).populate("userId").populate({
                path: "likes",
                model: 'User',
                select: { '_id': 1, 'name': 1 },
            }).populate({
                path: "comments.userId",
                model: 'User',
                select: { '_id': 1, 'name': 1 },
            })

            res.status(200).json(newDoc);

        } else if (type == "comment" && purpose == "add" && (comment.length > 0)) {

            const doc = await Post.updateOne({ _id: postId }, { $push: { comments: { userId: userId, comment: comment } } })
            const newDoc = await Post.findById(postId).populate("userId").populate({
                path: "likes",
                model: 'User',
                select: { '_id': 1, 'name': 1 },
            }).populate({
                path: "comments.userId",
                model: 'User',
                select: { '_id': 1, 'name': 1 },
            })

            res.status(200).json(newDoc);

        } else if (type == "like" && purpose == "delete") {

            const doc = await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            const newDoc = await Post.findById(postId).populate("userId").populate({
                path: "likes",
                model: 'User',
                select: { '_id': 1, 'name': 1 },
            }).populate({
                path: "comments.userId",
                model: 'User',
                select: { '_id': 1, 'name': 1 },
            })

            res.status(200).json(newDoc);

        } else if (type == "comment" && purpose == "delete") {

            const doc = await Post.updateOne({ _id: postId }, { $pull: { comments: { userId: userId, comment: comment } } })
            const newDoc = await Post.findById(postId).populate("userId").populate({
                path: "likes",
                model: 'User',
                select: { '_id': 1, 'name': 1 },
            }).populate({
                path: "comments.userId",
                model: 'User',
                select: { '_id': 1, 'name': 1 },
            })

            res.status(200).json(newDoc);

        } else {
            res.status(400).json("COMMENT OR LIKE CAN'T BE ADDED OR REMOVED");
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ 'message': 'Error In Adding Likes or Comment' });
    }
}