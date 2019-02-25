const expect = require("chai").expect;
const request = require("supertest");
const  app  = require("../../server");

const validUserData= require('../test_common');

const validateProfileInput = require('../../validation/profile');

// const lognString = "Abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";

validLoginData = {
    email:"test@hashcorp.com",
    password:"123456"
}

describe("007 Requirements for getting current User's Profile",()=>{
    before(done =>{
        if(global.JwtToken){
            done();
        } else{
            done(new Error("User did not login! JWT TOKEN not set. Aborting"));
        }
    });
    context("Getting user's profile is invalid if...", () => {
        it("Get request does not contain JWT bearer token", done => {
          request(app)
            .get("/api/profile")
            .set("Accept", "application/json")
            .expect(401)
            .end(err => {
              if (err) return done(err);
              done();
            });
        });
        it("JWT bearer token is invalid/Unauthorized access", done => {
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

describe("Profile validation",()=>{
    before(done =>{
        done();
    });
    context("User's profile validation",()=>{
        it("Handle is omitted", () => {
            returnData = validateProfileInput({ ...validUserData, handle: "" });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("handle");
            expect(returnData.errors.handle).to.equal(
              "Profile handle is required"
            );
          });
      
          it("status field is omitted", () => {
            returnData = validateProfileInput({ ...validUserData, status: "" });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("status");
            expect(returnData.errors.status).to.equal(
              "Status field is required"
            );
          });
      
          it("Skills field is omitted", () => {
            returnData = validateProfileInput({
              ...validUserData,
              skills: ""
            });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("skills");
            expect(returnData.errors.skills).to.equal(
              "Skills field is required"
            );
          });
          it("validate website links", () => {
            returnData = validateProfileInput({ ...validUserData, website: "test" });
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("website");
            expect(returnData.errors.website).to.equal(
              "Not a valid URL"
            );
          });
      
          
    })
})
//Sad path
describe("User's profile validation",()=>{
    before(done=>{
        done();
    });
    context("User's profile is valid if",()=>{
        it("All validators successfull",()=>{
          let  returnData = validateProfileInput({
            handle:'shaikh',
            status:'developer',
            skills:'testing',
            website:'www.facebook.com',
            youtube:'www.youtube.com',
            twitter:'www.twitter.com',
            facebook:'www.facebook.com',
            linkedin:'www.linkedin.com',
            instagram:'www.instagram.com'
          });
      expect(returnData.isValid).to.be.true;
      expect(returnData.errors).to.be.an("object").that.is.empty;
        })
    })
})

//Happy paths

describe('profile api end points',()=>{
    before(done=>{
        done();
    });
    context('checking profile of the user',()=>{
      //console.log(global.JwtToken)
       it('post the users profile',(done)=>{
           
           request(app)
           .post('/api/profile')
           .set("Authorization",global.JwtToken)
           .set("Accept", "application/json")
           .send({handle:"test514",status:"test",skills:"test"})
           .expect(200 )
           .expect(response =>{
             //console.log(response.body)
               let{_id,handle,status,skills} = response.body
               expect(_id).to.be.a('string');
               expect(handle).to.be.a('string');
               expect(handle).to.equal(handle);
               expect(status).to.be.a('string');
               expect(status).to.equal(status);
               expect(skills).to.be.a('array');
               expect(skills).to.equal(skills);
           })
           .end(err=>{
               if(err) return done(err);
               done();
           })
       })
    });
    context("current user",()=>{
      before(done=>{
        done();
    });
      it("show the current user",(done)=>{
        request(app)
        .get('/api/users/current')
        .send({...validUserData ,name:'User',email:'test@hashcorp.com'})
        .set("Authorization",global.JwtToken)
        .set("Accept", "application/json")
        .expect(200 )
        .expect(response => {
          //console.log(response.body)
          expect(response.body).to.have.ownProperty('email');
          expect(response.body.email).to.be.equal("test@hashcorp.com");
         
        })
        .end(err =>{
          if(err) return done(err);
          done();
        })
      })
    })
    //sad paths
    context('/api/profile/experience posting profile of the user',()=>{
        
      it('post the users experience profile',(done)=>{
          request(app)
          .post('/api/profile/experience')
          .send({email:"test@hashcorp.com",password:'123456',title:'test',company:'test',from:2019-01-01})
          .set("Authorization",global.JwtToken)
          .set("Accept", "application/json")
          .expect(500)
          .expect(response=>{
              console.log(response.body);
             let{_id,title,company,from} =response.body
             expect(_id).to.be.a('string');
             expect(title).to.have.ownProperty('title');
             expect(title).equal(title);
             expect(company).to.have.ownProperty('company');
             expect(company).equal(company);
             expect(from).to.have.ownProperty('from');
             expect(from).equal(from);
          })
          .end(err => {
             if (err) return done(err);
             done();
           });
      })
   });
});




