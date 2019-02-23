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
    
  } catch (error) {
    // console.log("collections not available");
  }
};

const validUserData = {
  name: "User",
  email: "test@hashcorp.com",
  password: "123456",
  password2: "123456",
  handle:'shaikh',
  status:'developer',
  skills:'testing',
  website:'',
  youtube:'www.youtube.com',
  twitter:'www.twitter.com',
  facebook:'www.facebook.com',
  linkedin:'www.linkedin.com',
  instagram:'www.instagram.com'
};

const setVerificationKey = async (userData, done) => {
  await User.findOne({
    email: userData.email
  })
    .then(user => {
      if (user) {
        user.verificationkey = userData.verificationkey;
        user.save().then(user => {
          // console.log("*********** ", user);
          done();
        });
      } else {
        done();
      }
    })
    .catch(error => {
      console.log("Setting verification key error ", error);
      done();
    });
};

const setPassKey = async (userData, done) => {
  await User.findOne({
    email: userData.email
  })
    .then(user => {
      if (user) {
        user.passkey = userData.passkey;
        user.save().then(user => {
          // console.log("*********** ", user);
          done();
        });
      } else {
        done();
      }
    })
    .catch(error => {
      console.log("Setting pass key error ", error);
      done();
    });
};

module.exports = {
  getCurrentNodeEnv,
  getCurrentMongo,
  getTestMongo,
  stopIfNotTestEnv,
  canConnectToDB,
  purgeDB,
  validUserData,
  setVerificationKey,
  setPassKey
};
