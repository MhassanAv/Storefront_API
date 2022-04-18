'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
/* eslint-disable @typescript-eslint/ban-ts-comment */
const supertest_1 = __importDefault(require('supertest'));
const app_1 = __importDefault(require('../../app'));
const db_1 = __importDefault(require('../../db'));
const request = (0, supertest_1.default)(app_1.default);
let token;
const u = {
  id: 1,
  username: 'avicii',
  first_name: 'any',
  last_name: 'any',
  password: 'ok',
};
const p = {
  id: 1,
  name: 'iphone 12',
  price: '$700',
};
describe('Test endpoint & CRUD porducts', () => {
  afterAll(async () => {
    // @ts-ignore
    const conn = await db_1.default.connect();
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await conn.query('DELETE FROM users');
    await conn.query('DELETE FROM products');
    conn.release();
  });
  beforeAll(async () => {
    await request.post('/signup').send(u);
    const response = await request.post('/signin').send(u);
    token = response.body.user.token;
  });
  describe('Test endpoint responses of products', () => {
    describe('Security testing', () => {
      it('create product endpoint', async () => {
        const response = await request.post('/products').send({
          ...p,
        });
        expect(response.status).toBe(401); //no token
      });
      it('update', async () => {
        const response = await request.put('/products/1').send({
          name: 'iphone 13',
          price: '$800',
        });
        expect(response.status).toBe(401); //no token
      });
      it('delete', async () => {
        const response = await request.delete('/products/1');
        expect(response.status).toBe(401); //no token
      });
    });
    describe('CRUD functionality testing', () => {
      it('create', async () => {
        const response = await request
          .post('/products')
          .set('authorization', `Bearer ${token}`)
          .send({
            ...p,
          });
        expect(response.status).toBe(200); //no token
      });
      it('index', async () => {
        const response = await request.get('/products');
        expect(response.status).toBe(200); //token
      });
      it('getone', async () => {
        const response = await request.get('/products/1');
        expect(response.status).toBe(200);
        expect(response.body.product.price).toBe('$700'); //token
      });
      it('update', async () => {
        const response = await request
          .put('/products/1')
          .set('authorization', `Bearer ${token}`)
          .send({
            name: 'iphone 13',
            price: '$800',
          });
        expect(response.status).toBe(200);
        expect(response.body.product.price).toBe('$800');
        expect(response.body.product.name).toBe('iphone 13'); //token
      });
      it('delete', async () => {
        const response = await request
          .delete('/products/1')
          .set('authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeNull; //token
      });
    });
  });
});
