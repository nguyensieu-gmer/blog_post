const { Router } = require("express");
const { prisma } = require("../lib/prisma");
const postRouter = Router();
const isAuth = require("../lib/isAuth");
const postController = require("../controller/postController");

// get posts and comments
postRouter.get("/", postController.getPostAndComments);

// create new post
postRouter.post("/", postController.postCreatePost);

// delete a post
postRouter.delete("/:postId", postController.postDeletePost);

// update a post
postRouter.put("/:postId", postController.postUpdatePost);

// create a new comment
postRouter.post("/:postId/comment", postController.postCreateComment);

module.exports = postRouter;
