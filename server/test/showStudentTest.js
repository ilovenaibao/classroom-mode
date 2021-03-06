var chai = require("chai")
var expect = chai.expect;
var sinon = require('sinon');
chai.use(require('sinon-chai'));
var app = require('../app');
var request = require('supertest');
var db = require('../routes/helpers/database_singleton').getDbInstance();
var scraper = require('../routes/helpers/scraper');

var sandbox = sinon.sandbox.create();

afterEach(function(){
   sandbox.restore();
});

describe('GET /students', () => {
  function stubDB(dummyStudentResults) {
    sandbox.stub(db, "collection").returns({
      find: function() {
        return {
          toArray: function(cb) {
            cb(null, dummyStudentResults);
          }
        };
      }
    });
  }

  function stubScraper(error, scraperResponse) {
    sandbox.stub(scraper, "fetchUserInfoFromFCC").yieldsAsync(error, scraperResponse);
  }

  it('should return 200', (done) => {
    var dummyStudentResults = [{ _id: "5a28cd1b1805592081cd31ea",
      name: 'studentName',
      username: 'studentUserName',
      email: 'studentEmail',
      notes: 'studentNote',
      __v: 0 }];
    stubDB(dummyStudentResults);
    stubScraper(false, {daysInactive: 1});
    request(app)
      .get('/students')
      .end(function(_err, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it('should fetch data from mongo DB', (done) => {
    var dummyStudentResults = [{ _id: "5a28cd1b1805592081cd31ea",
      name: 'studentName',
      username: 'studentUserName',
      email: 'studentEmail',
      notes: 'studentNote',
      __v: 0 }];
    stubDB(dummyStudentResults);
    stubScraper(false, {daysInactive: 1});
    request(app).get("/students").end(function(_err, res) {
      expect(JSON.parse(res.text)[0].name).to.equal(dummyStudentResults[0].name);
      expect(JSON.parse(res.text)[0].username).to.equal(dummyStudentResults[0].username);
      expect(JSON.parse(res.text)[0].email).to.equal(dummyStudentResults[0].email);
      expect(JSON.parse(res.text)[0].notes).to.equal(dummyStudentResults[0].notes);
      done();
    });
  });

  it('should return a 200 and an empty array if the database is empty', (done) => {
    var dummyStudentResults = [];
    stubDB(dummyStudentResults);
    request(app).get("/students").end(function(_err, res) {
      expect(res.status).to.equal(200);
      expect(JSON.parse(res.text)).to.be.an('array').that.is.empty;
      done();
    });
  });

  it('should look up student github username', (done) => {
    stubScraper(false, {daysInactive: 1});
    var dummyStudentResults = [{ _id: "5a28cd1b1805592081cd31ea",
      name: 'studentName',
      username: 'studentUserName',
      email: 'studentEmail',
      notes: 'studentNote',
      __v: 0 }];
    stubDB(dummyStudentResults);
    request(app).get("/students").end(function(_err, res) {
      expect(JSON.parse(res.text)[0].daysInactive).to.equal(1);
      done();
    });
  });

  it('should returns new submissions count and titles', (done) => {
    stubScraper(
      false,
      {
        completedChallenges: [
          { title: 'Reverse a String' },
          { title: 'Say Hello to HTML Elements' }
          ]
      });
    var dummyStudentResults = [{ _id: "5a28cd1b1805592081cd31ea",
      name: 'studentName',
      username: 'studentUserName',
      email: 'studentEmail',
      notes: 'studentNote',
      completedChallengesCount: 1,
      __v: 0
    }];
    stubDB(dummyStudentResults);
    request(app).get("/students").end(function(_err, res) {
      expect(JSON.parse(res.text)[0].newSubmissionsCount).to.equal(1);
      done();
    });
  });

  it('should returns new submissions count and titles when student completedChallengesCount is undefined', (done) => {
    stubScraper(
      false,
      {
        completedChallenges: [
          { title: 'Reverse a String' },
          { title: 'Say Hello to HTML Elements' }
          ]
      });
    var dummyStudentResults = [{ _id: "5a28cd1b1805592081cd31ea",
      name: 'studentName',
      username: 'studentUserName',
      email: 'studentEmail',
      notes: 'studentNote',
      __v: 0
    }];
    stubDB(dummyStudentResults);
    request(app).get("/students").end(function(_err, res) {
      expect(JSON.parse(res.text)[0].newSubmissionsCount).to.equal(2);
      done();
    });
  });
});
