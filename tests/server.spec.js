const app = require('../server/app');
const supertest = require('supertest');

describe('/products/list endpoint', () => {
  it('should pullback 1-5 with no params', (done) => {
    supertest(app)
      .get('/products/list')
      .then((resp) => {
        expect(resp.status).toBe(200);
        expect(resp.body.map((ele) => ele.id)).toEqual([1, 2, 3, 4, 5]);
        done();
      })
      .catch((err) => console.log(err));
  });

  it('should pullback 6-10 when page is 2', (done) => {
    supertest(app)
      .get('/products/list?page=2')
      .then((resp) => {
        expect(resp.status).toBe(200);
        expect(resp.body.map((ele) => ele.id)).toEqual([6, 7, 8, 9, 10]);
        done();
      })
      .catch((err) => console.log(err));
  });

  it('should pullback 20 entries when count is 20', (done) => {
    supertest(app)
      .get('/products/list?count=20')
      .then((resp) => {
        expect(resp.status).toBe(200);
        expect(resp.body.length).toEqual(20);
        done();
      })
      .catch((err) => console.log(err));
  });
});

describe('/products/:product_id endpoint', () => {
  it('should send a 404 if given an invalid product_id', (done) => {
    supertest(app)
      .get('/products/1000000000')
      .then((resp) => {
        expect(resp.status).toBe(404);
        done();
      })
      .catch((err) => console.log(err));
  });

  it('should send back an object with all relevant data', (done) => {
    supertest(app)
      .get('/products/1')
      .then((resp) => {
        expect(resp.status).toBe(200);
        expect(resp.body.id).toBeDefined();
        expect(resp.body.name).toBeDefined();
        expect(resp.body.slogan).toBeDefined();
        expect(resp.body.description).toBeDefined();
        expect(resp.body.category).toBeDefined();
        expect(resp.body.default_price).toBeDefined();
        expect(resp.body.features).toBeDefined();
        done();
      })
      .catch((err) => console.log(err));
  });

  describe('/products/:product_id/styles', () => {
    it('should send an object with id and empty array on invalid item', (done) => {
      supertest(app)
        .get('/products/hello/styles')
        .then((resp) => {
          expect(resp.status).toBe(200);
          expect(resp.body.product_id).toEqual('hello');
          expect(resp.body.results).toEqual([]);
          done();
        })
        .catch((err) => console.log(err));
    });

    it('should send back an object with all relevant data', (done) => {
      supertest(app)
        .get('/products/1/styles')
        .then((resp) => {
          expect(resp.status).toBe(200);
          expect(resp.body.product_id).toBeDefined();
          expect(resp.body.results[0].style_id).toBeDefined();
          expect(resp.body.results[0].name).toBeDefined();
          expect(resp.body.results[0].sale_price).toBeDefined();
          expect(resp.body.results[0].original_price).toBeDefined();
          expect(resp.body.results[0]['default?']).toBeDefined();
          expect(resp.body.results[0].photos).toBeDefined();
          done();
        })
        .catch((err) => console.log(err));
    });
  });

  describe('/products/:product_id/related', () => {
    it('should return an empty array on unknown product_id', (done) => {
      supertest(app)
        .get('/products/test/related')
        .then((resp) => {
          expect(resp.status).toBe(200);
          expect(resp.body).toEqual([]);
          done();
        })
        .catch((err) => console.log(err));
    });

    it('should return an array with all related product_ids', (done) => {
      supertest(app)
        .get('/products/1/related')
        .then((resp) => {
          expect(resp.status).toBe(200);
          expect(resp.body.length).toEqual(4);
          done();
        })
        .catch((err) => console.log(err));
    });
  });
});
