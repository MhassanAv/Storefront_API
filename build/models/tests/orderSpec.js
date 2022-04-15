'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
/* eslint-disable @typescript-eslint/ban-ts-comment */
const db_1 = __importDefault(require('../../db'));
const order_1 = require('../order');
const user_1 = require('../user');
const product_1 = require('../product');
const ostore = new order_1.orderStore();
const uStore = new user_1.UserStore();
const pStore = new product_1.productStore();
const u = {
  id: 1,
  username: 'avicii',
  first_name: 'any',
  last_name: 'any',
  password: 'ok',
};
const po = {
  order_id: 1,
  product_id: 1,
  quantity: 20,
};
const p = {
  id: 1,
  name: 'iphone 12',
  price: '$700',
};
describe('Orders Model', () => {
  it('should have an index method', () => {
    expect(ostore.index).toBeDefined();
  });
  it('should have a show method', () => {
    expect(ostore.show).toBeDefined();
  });
  it('should have a create method', () => {
    expect(ostore.create).toBeDefined();
  });
  it('should have a update method', () => {
    expect(ostore.edit).toBeDefined();
  });
  it('should have a addProduct method', () => {
    expect(ostore.addProduct).toBeDefined();
  });
  it('should have a delete method', () => {
    expect(ostore.delete).toBeDefined();
  });
  afterAll(async () => {
    // @ts-ignore
    const conn = await db_1.default.connect();
    await conn.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE orderProducts_id_seq RESTART WITH 1');
    await conn.query('DELETE FROM users');
    await conn.query('DELETE FROM products');
    await conn.query('DELETE FROM orders');
    await conn.query('DELETE FROM orderProducts');
    conn.release();
  });
  beforeAll(async () => {
    await uStore.create(u);
    await pStore.create(p);
  });
  describe('CRUD', () => {
    it('create method should add a orders', async () => {
      const result = await ostore.create({
        id: 1,
        status: 'active',
        user_id: 1,
      });
      expect(result.status).toBe('active');
      expect(result.user_id).toBe(1);
    });
    it('index method should return a list of orders', async () => {
      const result = await ostore.index();
      expect(result[0].status).toBe('active');
      expect(result[0].user_id).toBe(1);
    });
    it('show method should return the correct orders', async () => {
      const result = await ostore.show('1');
      expect(result.status).toBe('active');
      expect(result.user_id).toBe(1);
    });
    it('adding product to order', async () => {
      const result = await ostore.addProduct(po);
      expect(result.order_id).toBe(1);
      expect(result.product_id).toBe(1);
      expect(result.quantity).toBe(20);
    });
    it('delete method should remove the orders', async () => {
      ostore.delete('1');
      const result = await ostore.index();
      expect(result).not.toBeNull;
    });
  });
});
