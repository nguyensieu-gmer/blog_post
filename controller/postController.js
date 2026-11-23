const { prisma } = require("../lib/prisma");
const isAuth = require("../lib/isAuth");
const verifyToken = require("../lib/verifyToken");

async function verifyPost(req, res, next) {
  const postId = req.params.postId;
  if (!postId) {
    console.error("postId is not identify");
  }
  const user = await prisma.post.findFirst({
    where: {
      id: Number(postId),
      authorId: Number(req.user.id),
    },
  });
  if (!user) {
    return res.status(401).json({
      message: "Sorry but you not authorized to do this",
    });
  }
  next();
}

// get posts and comments
const getPostAndComments = async (req, res) => {
  const post = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: { comments: true, author: { select: { id: true, name: true } } },
  });
  res.json({
    post,
  });
};

// get user authenticated post
const getUserPost = [
  isAuth,
  async (req, res) => {
    const post = await prisma.post.findMany({
      where: { authorId: Number(req.user.id) },
      include: {
        comments: {
          include: { author: { select: { id: true, name: true } } },
        },
      },
    });
    res.json({
      post,
    });
  },
];

// create new post
const postCreatePost = [
  isAuth,
  verifyToken,
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
  verifyToken,
  verifyPost,
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
  verifyToken,
  verifyPost,
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
  verifyToken,
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

const postPublicPost = [
  isAuth,
  verifyToken,
  verifyPost,
  async (req, res) => {
    const postId = req.params.postId;
    if (!postId) {
      console.error("postId is not identify");
      res.status(400).json({ message: "post id is not identify" });
    }
    const post = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        published: true,
      },
    });
    res.status(200).json({
      message: "Public post successful",
    });
  },
];

const postUnpublicPost = [
  isAuth,
  verifyToken,
  verifyPost,
  async (req, res) => {
    const postId = req.params.postId;
    if (!postId) {
      console.error("postId is not identify");
      res.status(400).json({ message: "post id is not identify" });
    }
    const post = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        published: false,
      },
    });
    res.status(200).json({
      message: "Unpublic post successful",
    });
  },
];

module.exports = {
  getPostAndComments,
  postCreatePost,
  postDeletePost,
  postUpdatePost,
  postCreateComment,
  postPublicPost,
  postUnpublicPost,
  getUserPost,
};
