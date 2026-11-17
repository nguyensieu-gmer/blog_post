const { prisma } = require("../lib/prisma");
const isAuth = require("../lib/isAuth");

// get posts and comments
const getPostAndComments = async (req, res) => {
  const post = await prisma.post.findMany({
    include: { comments: true },
  });
  res.json({
    post,
  });
};

// create new post
const postCreatePost = [
  isAuth,
  async (req, res) => {
    const defaultUserId = req.user.id;
    const { title, content } = req.body;
    try {
      const post = await prisma.post.create({
        data: {
          title: title,
          content: content,
          authorId: defaultUserId,
        },
      });
      res.status(201).json({
        message: "Post created successful",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to create post",
      });
    }
  },
];

// delete a post
const postDeletePost = [
  isAuth,
  async (req, res) => {
    const postId = Number(req.params.postId);
    try {
      const post = await prisma.post.delete({
        where: {
          id: postId,
        },
      });
      res.status(200).json({
        message: "Post deleted successful",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to delete post",
      });
    }
  },
];

// update a post
const postUpdatePost = [
  isAuth,
  async (req, res) => {
    const postId = Number(req.params.postId);
    const { title, content } = req.body;
    try {
      const post = await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          title: title,
          content: content,
        },
      });
      res.status(200).json({
        message: "Post updated successful",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to update post",
      });
    }
  },
];

// create a new comment
const postCreateComment = [
  isAuth,
  isAuth,
  async (req, res) => {
    const postId = Number(req.params.postId);
    const defaultAuthor = req.user.id;
    const { comment } = req.body;
    try {
      const userComment = await prisma.comment.create({
        data: {
          comment: comment,
          authorId: defaultAuthor,
          postId: postId,
        },
      });
      res.status(200).json({
        message: "Created comment successful",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Failed to create comment",
      });
    }
  },
];

module.exports = {
  getPostAndComments,
  postCreatePost,
  postDeletePost,
  postUpdatePost,
  postCreateComment,
};
