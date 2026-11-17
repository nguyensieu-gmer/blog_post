const { Router } = require("express");
const postRouter = Router();
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

// public a post
postRouter.post("/:postId/publish", postController.postPublicPost);

// unpublic a post
postRouter.post("/:postId/unpublish", postController.postUnpublicPost);

module.exports = postRouter;
