const {expect} = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../eksamen/app.js");

chai.use(chaiHttp);
var agent = chai.request.agent(app);

//open integreret terminal -> run: "npm test "
//test: "mocha -- timeout 10000 -- unitTest" (forlænget timeout)

//Krav 12:
describe("Unittest af Krav 4", () => {  
  describe("POST /login", () => {                 
    it("logger korrekt testbruger", (done) => {
      agent
        .post('/login')
        .send({ email: 'test@1', password: 'test' })
        .end((err, res) => { 
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(res.body).to.equal(true);
          done();     
        });
    });
  });

  describe("POST /login", () => {                 
    it("logger falsk testbruger", (done) => {
      agent
        .post('/login')
        .send({ email: 'test@forkert', password: 'forkert' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(res.body).to.equal(false);
          done();     
        });
    });
  });

  describe("POST /login", () => {                 
    it("logger ingen testbruger", (done) => {
      agent
        .post('/login')
        .send({ email: '', password: '' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(res.body).to.equal(false);
          done();     
        });
    });
  });
  describe("POST /login", () => {                 
    it("logger korrekt email og forkert psw", (done) => {
      agent
        .post('/login')
        .send({ email: 'test@1', password: 'forkert' })
        .end((err, res) => { 
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(res.body).to.equal(false);
          done();     
        });
    });
  });
  describe("POST /login", () => {                 
    it("logger korrekt psw og forkert email", (done) => {
      agent
        .post('/login')
        .send({ email: 'forkert', password: 'test' })
        .end((err, res) => { 
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          expect(res.body).to.equal(false);
          done();     
        });
    });
  });
});

