const mongoose = require("mongoose");

const connectDatabase = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("MONGO_URI missing");

  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DBNAME || "bloxly_main",
    autoIndex: true,
  });

  console.log(
    "[post-service] Mongo connected to DB:",
    mongoose.connection.db.databaseName
  );
  return mongoose.connection;
};

module.exports = { connectDatabase };
