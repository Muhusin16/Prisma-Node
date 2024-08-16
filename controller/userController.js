const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    console.log('Fetched users:', users);

    const usersWithStringNumbers = users.map(user => ({
      ...user,
      number: user.number.toString()
    }));

    res.status(200).json(usersWithStringNumbers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users', details: error.message });
  }
};


exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }, // Convert id to a Number (Int)
      include: {
        posts: true, 
      },
    });

    if (user) {
      // Convert BigInt values to strings
      const userWithStringifiedBigInt = {
        ...user,
        number: user.number.toString(), // Convert BigInt number to string
        posts: user.posts.map(post => ({
          ...post,
        })),
      };

      res.status(200).json(userWithStringifiedBigInt);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user', details: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params; // id is a string from req.params
  const { name, email, number } = req.body;
  
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },  // Convert id to a regular Number
      data: {
        name,
        email,
        number: BigInt(number)  // Convert number to BigInt
      },
    });

    const userWithStringNumber = {
      ...user,
      number: user.number.toString()
    };

    res.status(200).json(userWithStringNumber);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Failed to update user', details: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: 'Failed to delete user', details: error.message });
  }
};
