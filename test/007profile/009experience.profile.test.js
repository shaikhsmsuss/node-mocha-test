const expect = require("chai").expect;
const request = require("supertest");
const  app  = require("../../server");

const validUserData= require('../test_common');

const validateProfileInput = require('../../validation/experience');


describe.only("009 experience api",()=>{
    before(done =>{
        if(global.JwtToken){
            done();
        } else{
            done(new Error("User did not login! JWT TOKEN not set. Aborting"));
        }
    });
    context("/api/profile/experience validation",()=>{
        it('school is omitted',()=>{
            let returnData = validateProfileInput({...validUserData ,title :""})
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("title");
            expect(returnData.errors.title).to.equal(
              "Job title field is required"
            );
        })
        it('degree is omitted',()=>{
            returnData = validateProfileInput({...validUserData ,company :""})
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("company");
            expect(returnData.errors.company).to.equal(
              "Company field is required"
            );
        })
        it('from date is omitted',()=>{
            returnData = validateProfileInput({...validUserData ,from :""})
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("from");
            expect(returnData.errors.from).to.equal(
              "From date field is required"
            );
        })
    })//context
    
})//describe


