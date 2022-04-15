/* eslint-disable @typescript-eslint/ban-ts-comment */
import supertest from 'supertest';
import app from '../../app';
import Client from '../../db';
import { orderProduct } from '../../models/order';
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

const po: orderProduct = {
  order_id: 1,
  product_id: 1,
  quantity: 20,
};

const p: product = {
  id: 1,
  name: 'iphone 12',
  price: '$700',
};

describe('Test endpoint & CRUD orders', () => {
  afterAll(async () => {
    // @ts-ignore
    const conn = await Client.connect();
    await conn.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    await conn.query('DELETE FROM products');
    await conn.query('DELETE FROM users');
    await conn.query('DELETE FROM orders');
    conn.release();
  });

  beforeAll(async () => {
    await request.post('/signup').send(u);
    const response = await request.post('/signin').send(u);
    token = response.body.user.token;
    await request
      .post('/products')
      .set('authorization', `Bearer ${token}`)
      .send({ user_auth_id: 1, ...p });
  });

  describe('Test endpoint responses of orders', () => {
    describe('Security testing', () => {
      it('create', async () => {
        const response = await request.post('/orders').send({
          status: 'active',
          user_id: 1,
        });
        expect(response.status).toBe(401); //no token
      });

      it('index', async () => {
        const response = await request.get('/orders');
        expect(response.status).toBe(401); //no token
      });

      it('getone', async () => {
        const response = await request.get('/orders/1');
        expect(response.status).toBe(401); //no token
      });

      it('add products to order', async () => {
        const response = await request.post('/orders/1/products/1');
        expect(response.status).toBe(401); //no token
      });

      it('update', async () => {
        const response = await request.put('/orders/1').send({
          status: 'active',
          user_id: 1,
        });
        expect(response.status).toBe(401); //no token
      });

      it('delete', async () => {
        const response = await request.delete('/orders/1');
        expect(response.status).toBe(401); //no token
      });
    });

    describe('CRUD functionality testing', () => {
      it('create', async () => {
        const response = await request
          .post('/orders')
          .set('authorization', `Bearer ${token}`)
          .send({
            user_auth_id: 1,
            status: 'active',
          });
        expect(response.status).toBe(200); //no token
      });

      it('index', async () => {
        const response = await request
          .get('/orders')
          .set('authorization', `Bearer ${token}`)
          .send({ user_auth_id: 1 });
        expect(response.status).toBe(200); //token
      });

      it('getone', async () => {
        const response = await request
          .get('/orders/1')
          .set('authorization', `Bearer ${token}`)
          .send({ user_auth_id: 1 });
        expect(response.status).toBe(200);
        expect(response.body.order.status).toBe('active'); //token
      });

      it('add products to order', async () => {
        const response = await request
          .post('/orders/1/products/1')
          .set('authorization', `Bearer ${token}`)
          .send({ user_auth_id: 1, ...po });
        expect(response.status).toBe(200); //token
      });

      it('update', async () => {
        const response = await request
          .put('/orders/1')
          .set('authorization', `Bearer ${token}`)
          .send({
            user_auth_id: 1,
            status: 'done',
            user_id: 1,
          });
        expect(response.status).toBe(200);
        expect(response.body.order.status).toBe('done'); //token
      });

      it('delete', async () => {
        const response = await request
          .delete('/orders/1')
          .set('authorization', `Bearer ${token}`)
          .send({ user_auth_id: 1 });
        expect(response.status).toBe(200);
        expect(response.body).toBeNull; //token
      });
    });
  });
});
