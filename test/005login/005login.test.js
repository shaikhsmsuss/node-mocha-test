const expect = require("chai").expect;
const request = require("supertest");
const app = require("../../server");
const validUserData = require("../test_common");
const validateLoginInput = require("../../validation/login");

//Happy tests
describe("User authentication", () => {
  let returnData = validateLoginInput(validUserData);
  context("Login invalid if ", () => {
    it("Email address is invalid", () => {
      returnData = validateLoginInput({
        ...validUserData,
        email: "apple"
      });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("email");
      expect(returnData.errors.email).to.equal("Email is invalid");
    });

    it("Email address is omitted", () => {
      returnData = validateLoginInput({
        ...validUserData,
        email: ""
      });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("email");
      expect(returnData.errors.email).to.equal("Email field is required");
    });

    it("Password is omitted", () => {
      returnData = validateLoginInput({
        ...validUserData,
        password: ""
      });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("password");
      expect(returnData.errors.password).to.equal("Password field is required");
    });

    it("Email address does not exists in the database", done => {
      request(app)
        .post("/api/users/login")
        .send({
          ...validUserData,
          email: "apple@apple.com",
          password: "1213256"
        }) // sending incorrect data
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(404)
        .expect(response => {
          expect(response.body).to.have.ownProperty("email");
          expect(response.body.email).to.equal("User not found");
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });

    it("Password is incorrect", done => {
      request(app)
        .post("/api/users/login")
        .send({ ...validUserData, email: "test@hashcorp.com", password: "aaa" }) // sending incorrect data
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400)
        .expect(response => {
          expect(response.body).to.have.ownProperty("password");
          expect(response.body.password).to.equal("Password incorrect");
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });

  //Happy paths
  context("Login valid if...", () => {
    it("All validators successfull", () => {
      let returnData = validateLoginInput({
        email: "test@hashcorp.com",
        password: "123456"
      });
      expect(returnData.isValid).to.be.true;
      expect(returnData.errors).to.be.an("object").that.is.empty;
    });
  }); //context

  context("Jwt token", () => {
    it("Received bearer jwt token as response", done => {
      request(app)
        .post("/api/users/login")
        .send({ email: "test@hashcorp.com", password: "123456" }) // sending verified user data
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect(response => {
          global.JwtToken = response.body.token;
          expect(response.body.success).to.be.true;
          expect(response.body).to.have.ownProperty("token");
          expect(response.body.token).to.be.a("string");
          // console.log(global.JwtToken)
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  });
});
