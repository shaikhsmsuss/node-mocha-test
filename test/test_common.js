const path = require("path");
const mongoose = require("mongoose");

// resolve .env path
const dotEnvPath = path.resolve("./.env");
// load .env configs
require("dotenv").config({ path: dotEnvPath });

const getCurrentNodeEnv = () => {
  // get current NODE_ENV
  return process.env.NODE_ENV;
};

const getCurrentMongo = () => {
  currentEnv = getCurrentNodeEnv();
  return process.env[`MONGO_URI_${currentEnv}`.toUpperCase()];
};

const getTestMongo = () => {
  return process.env[`MONGO_URI_TEST`];
};

const stopIfNotTestEnv = envVar => {
  if (envVar !== "test") {
    throw new Error("Development environment! Aborting!");
  }
};

const canConnectToDB = async mongoDBUri => {
  // return true;
  return await mongoose
    .connect(mongoDBUri, {
      useNewUrlParser: true,
      reconnectTries: 1,
      reconnectInterval: 0,
      socketTimeoutMS: 1000,
      connectTimeoutMS: 1000,
      useCreateIndex: true
    })
    .then(() => {
      // mongoose.connection.close();
      return true;
    })
    .catch(err => {
      throw new Error("Can't connect to Database! Aborting!");
    });
};

const purgeDB = async () => {
  try {
    await mongoose.connection.db.dropCollection("users");
    await mongoose.connection.db.dropCollection("profile");
    
  } catch (error) {
     console.log(error);
  }
};

const validUserData = {
  name: "User",
  email: "test@hashcorp.com",
  password: "123456",
  password2: "123456",
  handle:'shaikh',
  company:'cosmos',
  location:'hyderabad',
  handle:'shaikh',
  status:'developer',
  skills:['test','nodejs'],
  company:'cosmos',
  website:'www.facebook.com',
  social:{
      youtube:'www.youtube.com',
      twitter:'www.twitter.com',
      facebook:'www.facebook.com',
      linkedin:'www.linkedin.com',
      instagram:'www.instagram.com'
  },
};


module.exports = {
  getCurrentNodeEnv,
  getCurrentMongo,
  getTestMongo,
  stopIfNotTestEnv,
  canConnectToDB,
  purgeDB,
  validUserData,
  // setVerificationKey,
  // setPassKey
};
