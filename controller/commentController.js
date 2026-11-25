const isAuth = require("../lib/isAuth");
const { prisma } = require("../lib/prisma");
const verityToken = require("../lib/verifyToken");

const deleteCommment = [
  isAuth,
  verityToken,
  async (req, res) => {
    const commentId = Number(req.params.commentId);
    try {
      const comment = await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
      return res.status(200).json({
        message: "Deleted comment",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Failed to delete a comment",
      });
    }
  },
];

module.exports = { deleteCommment };
