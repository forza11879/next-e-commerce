import mongoose from 'mongoose';

export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;

  const uri = process.env.MONGODB_URL;
  // console.log('uri: ', uri);
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
    console.error(e);
  }

  return next();
}

// import mongoose from 'mongoose';

// const connection = {};

// async function database(req, res, next) {
//   try {
//     //  check if we have connection to our databse
//     if (connection.isConnected) {
//       return;
//     }
//     const uri = process.env.MONGODB_URL;
//     // console.log('uri: ', uri);
//     const options = {
//       socketTimeoutMS: 30000,
//       keepAlive: true,
//       poolSize: 10,
//       useNewUrlParser: true,
//       useFindAndModify: false,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//     };
//     mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
//     // Connect to our Database and handle any bad connections
//     const db = await mongoose.connect(uri, options);

//     connection.isConnected = db.connections[0].readyState;

//     const dbConnections = mongoose.connection;

//     dbConnections.on('error', (err) => {
//       console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
//     });

//     console.log('database connected');
//     return next();
//   } catch (err) {
//     console.error(`Error connectDb: ${err}`);
//   }
// }

// export default database;
