const expect = require("chai").expect;
const request = require("supertest");
const app = require("../../server");

const validUserData = require("../test_common");

const validatePostinput = require("../../validation/post");

describe("013 post api", () => {
  before(done => {
    if (global.JwtToken) {
      done();
    } else {
      done(new Error("User did not login! JWT TOKEN not set. Aborting"));
    }
  });
  context("/api/post validation", () => {
    it("post is omitted", () => {
      let returnData = validatePostinput({ ...validUserData, text: "" });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("text");
      expect(returnData.errors.text).to.equal("Text field is required");
    });
    it(" Post is less than 10 characters", () => {
      returnData = validatePostinput({ ...validUserData, text: "agdfgd" });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("text");
      expect(returnData.errors.text).to.equal(
        "Post must be between 10 and 300 characters"
      );
    });
  });
});

describe("post routes", () => {
  before(done => {
    done();
  });
  context("GET post route", () => {
    it("Shows no post for this user", done => {
      request(app)
        .get("/api/posts")
        .send({ email: "test@hashcorp.com", password: "123456" })
        .set("Accept", "application/json")
        .expect(200)
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
  context("post data", () => {
    it("post the user's data", done => {
      request(app)
        .post("/api/posts")
        .send({ text: "this is post api route" })
        .set("Authorization", global.JwtToken)
        .set("Accept", "application/json")
        .expect(200)
        .expect(response => {
          let { _id, text } = response.body;
          expect(_id).to.be.a("string");
          expect(text).to.be.a("string");
          expect(text).equal(text);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
});
