const {expect} = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../eksamen/app.js");

chai.use(chaiHttp);
var agent = chai.request.agent(app)

//Krav 9 testes her
describe("Unittest af Krav 4", () => {  
  describe("POST /login", () => {                 
    it("logger korrekt testbruger", (done) => {
      agent
        .post('/login')
        .send({ email: 'test@1', password: 'test' })
        .end((err, res, result) => { //result == null
          expect(err).to.be.null;
          expect(res.status).to.equal(200);
          //indsæt ny
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
          //indsæt ny
          done();     
        });
    });
  });
  describe("GET /loggedstatus", () => {  
    it("kontrollere loggedstatus", (done) =>{
      agent
      .post('/login')
      .send({ email: 'test@1', password: 'test' })
      .then(function(res){
        agent.get('/loggedstatus')
             .end((err, res) => {
               expect(err).to.be.null;
                expect(res.status).to.equal(200);
                //indsæt ny
                done();
             });
      });
    });
  });
});

