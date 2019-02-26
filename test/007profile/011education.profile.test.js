const expect = require("chai").expect;
const request = require("supertest");
const  app  = require("../../server");

const validUserData= require('../test_common');

const validateProfileInput = require('../../validation/education');


describe.only("011 education api",()=>{
    before(done =>{
        if(global.JwtToken){
            done();
        } else{
            done(new Error("User did not login! JWT TOKEN not set. Aborting"));
        }
    });
    context("/api/profile/education validation",()=>{
        it('001school is omitted',()=>{
            let returnData = validateProfileInput({...validUserData ,school :""})
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("school");
            expect(returnData.errors.school).to.equal(
              "School field is required"
            );
        })
        it('002degree is omitted',()=>{
            returnData = validateProfileInput({...validUserData ,degree :""})
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("degree");
            expect(returnData.errors.degree).to.equal(
              "Degree field is required"
            );
        })
        it('003fieldofstudy is omitted',()=>{
            returnData = validateProfileInput({...validUserData ,fieldofstudy :""})
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("degree");
            expect(returnData.errors.fieldofstudy).to.equal(
              "Field of study field is required"
            );
        })
        it('004from date is omitted',()=>{
            returnData = validateProfileInput({...validUserData ,from :""})
            expect(returnData.isValid).to.be.false;
            expect(returnData.errors).to.have.ownProperty("from");
            expect(returnData.errors.from).to.equal(
              "From date field is required"
            );
        });
    });
});

//sad paths
describe('002profile education route',()=>{
  context('001/api/profile/education',()=>{
        it('Post the education data',(done)=>{
             request(app)
            .post('/api/profile/education')
            .send({school:'test',degree:'test',fieldofstudy:'test',from:2019-01-01})
            .set("Authorization",global.JwtToken)
            .set("Accept", "application/json")
            .expect(200)
            .expect(response =>{
                console.log(response.body)
                let{_id,school,degree,fieldofstudy,from} = response.body
                expect(_id).to.be.a('string');
                expect(school).to.be.a('string');
                expect(school).to.equal(school);
                expect(degree).to.be.a('string');
                expect(degree).to.equal(degree);
                expect(fieldofstudy).to.be.a('string');
                expect(fieldofstudy).to.equal(fieldofstudy);
                expect(from).to.be.a('date');
                expect(from).to.equal(from);
            })
            .end(err =>{
                if(err) return done(err);
                done();
            });
        });
    });   
});