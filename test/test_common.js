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
    let mongoDBUri =  process.env[`MONGO_URI_${currentEnv}`.toUpperCase()];
  // console.log("=====",mongoDBUri);
  return mongoDBUri;
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
      // console.log("DB Connection successful!")
      return true;
    })
    .catch(err => {
      throw new Error("Can't connect to Database! Aborting!");
    });
};

const purgeDB = (done) => {
  // console.log("Current Environment - ", process.env.NODE_ENV)
  try {
    mongoose.connection.db.listCollections().toArray(function(err, names) {
        if (err) {
            console.log(err);
        }
        else {
            names.forEach(function(e,i,a) {
                mongoose.connection.db.dropCollection(e.name);
                // console.log("--->>", e.name);
            });
            // console.log("DB Collections ",names)
        }
        done()
    });
    
  } catch (error) {
    done()
  }
};

const validUserData = {
  name: "User",
  email: "test@hashcorp.com",
  password: "123456",
  password2: "123456",
  handle:'shaikh',
  location:'hyderabad',
  status:'developer',
  skills:['test','nodejs'],
  website:'www.facebook.com',
  title:'test',
  company:'hashcorp',
  from:2019-01-01,
  school:'test',
  degree:'test',
  fieldofstudy:'test',
  text:'this is post route',
}

module.exports = {
  getCurrentNodeEnv,
  getCurrentMongo,
  getTestMongo,
  stopIfNotTestEnv,
  canConnectToDB,
  purgeDB,
  validUserData,
};
