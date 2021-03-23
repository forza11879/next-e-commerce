import mongoose from 'mongoose';

export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGODB_URL;
  const options = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 10,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };

  return await mongoose.connect(uri, options);
}

export function jsonify(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default async function dbMiddleware(req, res, next) {
  try {
    if (!global.mongoose) {
      global.mongoose == (await dbConnect());
      console.log('database connected');
    }
  } catch (e) {
    console.error('mongoDB error:', e);
    res.status(500).json({ message: 'Connecting to database failed' });
    return;
  }

  return next();
}
