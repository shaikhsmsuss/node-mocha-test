const expect = require("chai").expect;
const request = require("supertest");
const app = require("../../server");

const validUserData = require("../test_common");

const validateProfileInput = require("../../validation/profile");

// const lognString = "Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";

validLoginData = {
  email: "test@hashcorp.com",
  password: "123456"
};

describe("007 Requirements for getting current User's Profile", () => {
  before(done => {
    if (global.JwtToken) {
      done();
    } else {
      done(new Error("User did not login! JWT TOKEN not set. Aborting"));
    }
  });

  context("001Getting user's profile is invalid if...", () => {
    it("001Get request does not contain JWT bearer token", done => {
      request(app)
        .get("/api/profile")
        .set("Accept", "application/json")
        .expect(401)
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
    it("002JWT bearer token is invalid/Unauthorized access", done => {
      request(app)
        .get("/api/profile")
        .set(
          "Authorization",
          "bearer JGKHJVGFGjfjgfFHGFJVkjmghfut75567465edcfDYHFFD"
        )
        .set("Accept", "application/json")
        .expect(401)
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
    // it("Get request does not contain JWT bearer token");
  });
});

describe("002Profile validation", () => {
  before(done => {
    done();
  });
  context("002User's profile validation", () => {
    it("001Handle is omitted", () => {
      returnData = validateProfileInput({ ...validUserData, handle: "" });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("handle");
      expect(returnData.errors.handle).to.equal("Profile handle is required");
    });

    it("002status field is omitted", () => {
      returnData = validateProfileInput({ ...validUserData, status: "" });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("status");
      expect(returnData.errors.status).to.equal("Status field is required");
    });

    it("003Skills field is omitted", () => {
      returnData = validateProfileInput({
        ...validUserData,
        skills: ""
      });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("skills");
      expect(returnData.errors.skills).to.equal("Skills field is required");
    });

    it("004validate website links", () => {
      returnData = validateProfileInput({ ...validUserData, website: "test" });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("website");
      expect(returnData.errors.website).to.equal("Not a valid URL");
    });
  });
});
//Sad path
describe("003User's profile validation", () => {
  before(done => {
    done();
  });
  context("003User's profile is valid if", () => {
    it("001All validators successfull", () => {
      let returnData = validateProfileInput({
        handle: "shaikh",
        status: "developer",
        skills: "testing",
        website: "www.facebook.com",
        youtube: "www.youtube.com",
        twitter: "www.twitter.com",
        facebook: "www.facebook.com",
        linkedin: "www.linkedin.com",
        instagram: "www.instagram.com"
      });
      expect(returnData.isValid).to.be.true;
      expect(returnData.errors).to.be.an("object").that.is.empty;
    });
  });
});

//Happy paths

describe("004profile api end points", () => {
  context("004checking profile of the user", () => {
    //console.log(global.JwtToken)
    it("001post the users profile", done => {
      request(app)
        .post("/api/profile")
        .set("Authorization", global.JwtToken)
        .set("Accept", "application/json")
        .send({ handle: "test14", status: "test", skills: "test" })
        .expect(200)
        .expect(response => {
          console.log(response.body);
          let { _id, handle, status, skills } = response.body;
          expect(_id).to.be.a("string");
          expect(handle).to.be.a("string");
          expect(handle).to.equal(handle);
          expect(status).to.be.a("string");
          expect(status).to.equal(status);
          expect(skills).to.be.a("array");
          expect(skills).to.equal(skills);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
  context("005current user", () => {
    before(done => {
      done();
    });
    it("001show the current user", done => {
      request(app)
        .get("/api/users/current")
        .send({ ...validUserData, name: "User", email: "test@hashcorp.com" })
        .set("Authorization", global.JwtToken)
        .set("Accept", "application/json")
        .expect(200)
        .expect(response => {
          //console.log(response.body)
          expect(response.body).to.have.ownProperty("email");
          expect(response.body.email).to.be.equal("test@hashcorp.com");
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
});
