/* eslint-disable @typescript-eslint/ban-ts-comment */
import supertest from 'supertest';
import app from '../../app';
import Client from '../../db';
import { product } from '../../models/product';
import { user } from '../../models/user';

const request = supertest(app);

let token: string;

const u: user = {
  id: 1,
  username: 'avicii',
  first_name: 'any',
  last_name: 'any',
  password: 'ok',
};

const p: product = {
  id: 1,
  name: 'iphone 12',
  price: '$700',
};
describe('Test endpoint & CRUD porducts', () => {
  afterAll(async () => {
    // @ts-ignore
    const conn = await Client.connect();
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

      it('index', async () => {
        const response = await request.get('/products');
        expect(response.status).toBe(401); //no token
      });

      it('getone', async () => {
        const response = await request.get('/products/1');
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
            user_auth_id: 1,
            ...p,
          });
        expect(response.status).toBe(200); //no token
      });

      it('index', async () => {
        const response = await request
          .get('/products')
          .set('authorization', `Bearer ${token}`)
          .send({ user_auth_id: 1 });
        expect(response.status).toBe(200); //token
      });

      it('getone', async () => {
        const response = await request
          .get('/products/1')
          .set('authorization', `Bearer ${token}`)
          .send({ user_auth_id: 1 });
        expect(response.status).toBe(200);
        expect(response.body.product.price).toBe('$700'); //token
      });

      it('update', async () => {
        const response = await request
          .put('/products/1')
          .set('authorization', `Bearer ${token}`)
          .send({
            user_auth_id: 1,
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
          .set('authorization', `Bearer ${token}`)
          .send({ user_auth_id: 1 });
        expect(response.status).toBe(200);
        expect(response.body).toBeNull; //token
      });
    });
  });
});
