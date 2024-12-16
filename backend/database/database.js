if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.DATABASE_URL);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(process.env.DATABASE_NAME);
  } catch (err) {
    console.error('Database connection failed', err);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };
