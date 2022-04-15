'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
/* eslint-disable @typescript-eslint/ban-ts-comment */
const db_1 = __importDefault(require('../../db'));
const order_1 = require('../../models/order');
const user_1 = require('../../models/user');
const product_1 = require('../../models/product');
const orderProduct_1 = require('../../services/orderProduct');
const oStore = new order_1.orderStore();
const uStore = new user_1.UserStore();
const pStore = new product_1.productStore();
const opStore = new orderProduct_1.orderProducts();
const u = {
  id: 1,
  username: 'avicii',
  first_name: 'any',
  last_name: 'any',
  password: 'ok',
};
const op = {
  order_id: 1,
  product_id: 1,
  quantity: 20,
};
const p = {
  id: 1,
  name: 'iphone 12',
  price: '$700',
};
const o = {
  id: 1,
  status: 'active',
  user_id: 1,
};
describe('OrderProducts Model', () => {
  it('should have an All orders method', () => {
    expect(opStore.allOrders).toBeDefined();
  });
  it('should have an All orders method', () => {
    expect(opStore.activeOrders).toBeDefined();
  });
  it('should have an All orders method', () => {
    expect(opStore.Orders).toBeDefined();
  });
  beforeAll(async () => {
    await uStore.create(u);
    await pStore.create(p);
    await oStore.create(o);
    await oStore.addProduct(op);
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
  describe('Showing products of orders', () => {
    it('shows all orders and products', async () => {
      const result = await opStore.allOrders();
      expect(result[0].status).toBe('active');
      expect(result[0].username).toBe('avicii');
      expect(result[0].order_items).not.toBeNull;
    });
    it('shows all products of one order', async () => {
      const result = await opStore.Orders('1');
      expect(result[0].status).toBe('active');
      expect(result[0].username).toBe('avicii');
      expect(result[0].order_items).not.toBeNull;
    });
    it('shows all products of active orders', async () => {
      const result = await opStore.activeOrders();
      expect(result[0].order_id).toBe(1);
      expect(result[0].status).toBe('active');
      expect(result[0].username).toBe('avicii');
      expect(result[0].order_items).not.toBeNull;
    });
  });
});
