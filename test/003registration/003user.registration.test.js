const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");

const { purgeDB, validUserData } = require("../test_common");

const validateRegisterInput = require("../../validation/register");

const app = require("../../server");

const longString = "Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";

//Happy tests
describe("002 User registration requirements", () => {
  // before(done =>{
  //     purgeDB(done);
  // });

  let returnData = validateRegisterInput(validUserData);

  context("001Registration valid if", () => {
    it("All validators successfull", () => {
      expect(returnData.isValid).to.be.true;
      expect(returnData.errors).to.be.an("object").that.is.empty;
    });

    it("001User record was created in the database", function(done) {
      this.timeout(15000);
      request(app)
        .post("/api/users/register")
        .send(validUserData)
        .set("Accept", "application/json")
        .expect(200)
        .expect(response => {
          let { email, name, _id } = response.body;
          expect(_id).to.be.a("string");
          expect(name).to.be.a("string");
          expect(name).equal(validUserData.name);
          expect(email).to.be.a("string");
          expect(email).equal(validUserData.email);
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  }); //context
  context("002Registration invalid if...", () => {
    it("001Name is omitted", () => {
      returnData = validateRegisterInput({ ...validUserData, name: "" });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("name");
      expect(returnData.errors.name).to.equal("Name field is required");
    });

    it(" 002Name is less than 2 characters", () => {
      returnData = validateRegisterInput({ ...validUserData, name: "a" });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("name");
      expect(returnData.errors.name).to.equal(
        "Name must be between 2 and 30 characters"
      );
    });

    it("003Email address is omitted", () => {
      returnData = validateRegisterInput({ ...validUserData, email: "" });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("email");
      expect(returnData.errors.email).to.equal("Email is invalid");
    });

    it("004Email address is invalid", () => {
      returnData = validateRegisterInput({
        ...validUserData,
        email: "apple"
      });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("email");
      expect(returnData.errors.email).to.equal("Email is invalid");
    });

    it("005Password is omitted or it is less than 6 characters", () => {
      returnData = validateRegisterInput({ ...validUserData, password: "" });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("password");
      expect(returnData.errors.password).to.equal(
        "Password must be at least 6 characters"
      );
    });

    it("006Confirm Password is omitted / Password and Confirm Password do not match", () => {
      returnData = validateRegisterInput({ ...validUserData, password2: "" });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("password2");
      expect(returnData.errors.password2).to.equal("Passwords must match");
    });

    it("007Password is less than 6 characters", () => {
      returnData = validateRegisterInput({
        ...validUserData,
        password: "abc",
        password2: "abc"
      });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("password");
      expect(returnData.errors.password).to.equal(
        "Password must be at least 6 characters"
      );
    });
    it("008Password is greater than 30 characters", () => {
      returnData = validateRegisterInput({
        ...validUserData,
        password: longString + "1*",
        password2: longString + "1*"
      });
      expect(returnData.isValid).to.be.false;
      expect(returnData.errors).to.have.ownProperty("password");
      expect(returnData.errors.password).to.equal(
        "Password must be at least 6 characters"
      );
    });
    it("009Email address already exists in the database", function(done) {
      this.timeout(10000);
      request(app)
        .post("/api/users/register")
        .send(validUserData) // sending correct data
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(400)
        .expect(response => {
          expect(response.body).to.have.ownProperty("email");
          expect(response.body.email).to.equal("Email already exists");
        })
        .end(err => {
          if (err) return done(err);
          done();
        });
    });
  }); //context
}); //describe
