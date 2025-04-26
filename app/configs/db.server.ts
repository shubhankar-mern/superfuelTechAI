import mongoose from 'mongoose';

let db: mongoose.Connection;

export async function connectDb() {
  if (db) {
    return db;
  }

  // Get MongoDB URI from environment variable
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/supertech';

  try {
    await mongoose.connect(MONGODB_URI);
    db = mongoose.connection;

    db.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });

    db.once('open', () => {
      console.log('Connected to MongoDB successfully');
    });

    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export function closeDb() {
  if (db) {
    return db.close();
  }
}