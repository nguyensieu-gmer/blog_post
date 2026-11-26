const { prisma } = require("./lib/prisma");

const getPostAndComments = async (req, res) => {
  const post = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      comments: {
        select: {
          id: true,
          comment: true,
          author: { select: { id: true, name: true } },
        },
      },
      author: { select: { id: true, name: true } },
    },
  });
  console.log(post);
};

getPostAndComments();
