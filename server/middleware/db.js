import mongoose from 'mongoose';
import initMiddleware from '@/middleware/init-middelware';
export async function dbConnect() {
  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2 and 3)
  if (mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGODB_URL;
  const options = {
    socketTimeoutMS: 30000,
    keepAlive: true,
    poolSize: 10,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };

  return await mongoose.connect(uri, options);
}

export function jsonify(obj) {
  return JSON.parse(JSON.stringify(obj));
}

async function dbMiddleware(req, res, next) {
  try {
    // if (!global.mongoose) {
    //   global.mongoose == (await dbConnect());
    //   console.log('database connected');
    // }
    await dbConnect();
  } catch (e) {
    console.error('mongoDB error:', e);
    res.status(500).json({ message: 'Connecting to database failed' });
    return;
  }

  return next();
}

export default initMiddleware(dbMiddleware);
