const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const {
  stopIfNotTestEnv,
  getCurrentNodeEnv,
  getCurrentMongo,
  getTestMongo,
  canConnectToDB,
  purgeDB
} = require("../test_common");

const  app  = require('../../server');

// // get current NODE_ENV
const currentEnv = getCurrentNodeEnv(); //process.env.NODE_ENV;

describe("001 Testing Environments Requirements", () => {
  before(done => {
    global.JwtToken = null;
    stopIfNotTestEnv(currentEnv);
    canConnectToDB(getTestMongo()).catch(err => {
      done(new Error("DB Server not available! Aborting!"));
    });
    done();
  });

  after(done => {
    purgeDB().then(() => {
      done();
    });
  });
  const purgeDB = async () => {
    try {
      await mongoose.connection.db.dropCollection("users");
      await mongoose.connection.db.dropCollection("profile");
      
    } catch (error) {
      // console.log("collections not available");
    }
  };

  context("Running tests if...", () => {
    it("current NODE_ENV is `test`", () => {
      expect(currentEnv).to.be.equal("test");
    });

    it("test environment specific MongoDB URI is loaded", () => {
      expect(getCurrentMongo()).to.be.equal(getTestMongo());
    });

    it("MongoDB server is connected", async function() {
      this.timeout(10000);
      const DBConnected = await canConnectToDB(getTestMongo());
      if (!DBConnected) {
        throw new Error("Can't connect to Database! Aborting!");
      }
      expect(DBConnected).to.be.true;
    });

    it("API Server is running", done => {
      request(app)
        .get("/test")
        .expect(200)
        .end((err, response) => {
          expect(response.body)
            // .to.have.property("status")
            // .to.equal("success");
          done(err);
        });
    });
  });
});
