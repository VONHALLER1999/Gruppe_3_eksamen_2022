const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { response } = require("../app");
const app = require("../app");

chai.use(chaiHttp);

describe("API", () => {
  describe("GET /localstoragestatus", () => {
    it("It should NOT return an error", (done) => {
      chai
        .request(app)
        .get("/localstoragestatus")
        .end((err, res) => {
          expect(err).to.be.null;
          done();
        });
    });
    it("It should return an 200 status ", (done) => {
      chai
        .request(app)
        .get("/localstoragestatus")
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          done();
        });
    });
    it("It should return an object ", (done) => {
      chai
        .request(app)
        .get("/localstoragestatus")
        .end((err, res) => {
          expect(response).to.be.an("object");
          done();
        });
    });
  });
});
