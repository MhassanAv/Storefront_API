/* eslint-disable @typescript-eslint/ban-ts-comment */
import Client from '../../db';
import { order, orderProduct, orderStore } from '../../models/order';
import { UserStore, user } from '../../models/user';
import { product, productStore } from '../../models/product';
import {orderProducts} from '../../services/orderProduct'

const oStore = new orderStore();
const uStore = new UserStore();
const pStore = new productStore();
const opStore = new orderProducts();

const u: user = {
  id: 1,
  username: 'avicii',
  first_name: 'any',
  last_name: 'any',
  password: 'ok',
};

const op: orderProduct = {
  order_id: 1,
  product_id: 1,
  quantity: 20,
};

const p: product = {
  id:1,
  name: 'iphone 12',
  price: '$700',
};

const o: order = {
    id:1,
    status: "active",
    user_id:1
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
    const conn = await Client.connect();
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
      const result = await opStore.allOrders()
      expect(result[0].status).toBe('active');
      expect(result[0].username).toBe('avicii')
      expect(result[0].order_items).not.toBeNull
    });

    it('shows all products of one order', async () => {
        const result = await opStore.Orders("1");
        expect(result[0].status).toBe('active');
        expect(result[0].username).toBe('avicii')
        expect(result[0].order_items).not.toBeNull
      });

      it('shows all products of active orders', async () => {
        const result = await opStore.activeOrders();
        expect(result[0].order_id).toBe(1);
        expect(result[0].status).toBe('active');
        expect(result[0].username).toBe('avicii')
        expect(result[0].order_items).not.toBeNull
      });
    

  })
})
