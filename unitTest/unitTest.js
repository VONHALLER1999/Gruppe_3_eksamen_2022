const {expect} = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../eksamen/app.js");

chai.use(chaiHttp);


/* Krav 9 testes her... den er måske lidt for nem? */
//mistænker det er mit setup som fucker med resulatatet. det her burde virke

describe("Krav 12 - Unit Test", () => {  


  describe("GET /logout", () => {                   //tester om endpointet er aktiveret
    it("session skal være 'false", (done) => {
      chai
      .request(app)
      .get("/logoutUser")
      .end((err, req) => {
        //expect(res.status).to.equal(200);
        expect(err).to.be.null;
        expect(req.session.loggedIn).to.be.false;
        done();   
      });
    });    
  });
  /*
  describe("GET /logout", () => {                   //tester om endpointet er aktiveret
    it("session skal være 'false", (done) => {
      chai
      .request(app)
      .get("/logoutUser")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();   
      });
    });    
  });
  */
  describe("GET /loggedstatus", () => {             //tester om selve sessionen er ændret
    it("session skal være 'false", (done) => {
      chai
      .request(app)
      .get("/loggedstatus")
      .end((err, res) => {
        res.should.have.status(false);
        done();   
      });
    });    
  });

});

/*
app.get("/logout", (req, res) => {
  try {
    req.session.loggedIn = false;
    req.session.username = null;
    console.log("User logged out")
    res.send(true)
    res.status(200);
  } catch (err) {
    console.log(err);
    res.status(400)
  }
});

app.get("/loggedstatus", async (req, res) => {
  if (req.session.loggedIn) {   
    res.send(true);
  } else {
    res.send(false);
  }
});

*/