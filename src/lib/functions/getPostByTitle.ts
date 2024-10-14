import prisma from "@/lib/utils/prisma";

const getPostByTitle = async (title: string) => {
  return prisma.post.findFirst({
    where: {
      title: {
        equals: title,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      title: true,
      description: true,
      content: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          likes: true,
        },
      },
      thumbnail: {
        select: {
          path: true,
        },
      },
      author: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      topic: {
        select: {
          id: true,
          name: true,
        },
      },
      series: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export default getPostByTitle;
