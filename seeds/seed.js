const mongoose = require('mongoose');
const { User, Thought } = require('../models');
const { users, thoughts } = require('./dataSeeds');

// Update the connection string
const connectionString = 'mongodb://127.0.0.1:27017/socialDB';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Promise.all([User.deleteMany(), Thought.deleteMany()]);

    // Create new users and thoughts
    const createdUsers = await User.create(users);
    const createdThoughts = await Thought.create(thoughts);

    // Update user's thoughts
    for (const thought of createdThoughts) {
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      randomUser.thoughts.push(thought);
      await randomUser.save();
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
