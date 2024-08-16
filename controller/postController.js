const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.createPost = async (req, res) => {
  const { title, content, published, authorId } = req.body;

  try {
    const authorIdInt = Number(authorId);

    const authorExists = await prisma.user.findUnique({
      where: { id: authorIdInt }, // Use authorId as an Int
    });

    if (!authorExists) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published,
        authorId: req.userId,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create post', details: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

exports.getPostById = async (req, res) => {
    const { id } = req.params;
    try {
      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
        include: { author: true }, 
      });
  
      if (post) {
        // Convert any BigInt values to strings
        const postWithStringifiedBigInt = {
          ...post,
          author: {
            ...post.author,
            number: post.author.number.toString(), // Convert author's number (BigInt) to string if it's a BigInt
          },
        };
  
        res.status(200).json(postWithStringifiedBigInt);
      } else {
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch post', details: error.message });
    }
  };
  
exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, published } = req.body;
  try {
    const post = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content, published },
    });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
