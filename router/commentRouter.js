const { Router } = require("express");
const commentRouter = Router();
const commentController = require("../controller/commentController");

// delete a comment
commentRouter.delete("/:commentId", commentController.deleteCommment);

module.exports = commentRouter;
