/* eslint-disable @typescript-eslint/ban-ts-comment */
import Client from '../../db';
import { orderProduct, orderStore } from '../order';
import { UserStore,user } from '../user';
import{product,productStore} from '../product'

const ostore = new orderStore();
const uStore = new UserStore();
const pStore = new productStore();
const u:user ={
    id:1,
    username: 'avicii',
    first_name: 'any',
    last_name: 'any',
    password: 'ok'
  }

const po:orderProduct={
    order_id: 1,
    product_id: 1,
    quantity: 20,
}

const p:product={
    name: "iphone 12",
    price:"$700"
  }

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

  it('should have a delete method', () => {
    expect(ostore.delete).toBeDefined();
  });
  

  beforeAll(async () => {
    // @ts-ignore
    await uStore.create(u);
    await pStore.create(p);
  });

  afterAll(async () => {
    // @ts-ignore
    const conn = await Client.connect();
    await conn.query('ALTER SEQUENCE orders_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
    await conn.query('DELETE FROM orderProducts');
    await conn.query('DELETE FROM orders');
    await conn.query('DELETE FROM users');
    await conn.query('DELETE FROM products');
    conn.release();
  });

  describe('CRUD', () => {
    it('create method should add a orders', async () => {
      const result = await ostore.create({
        status: 'active',
        user_id: 1
      });

      expect(result.status).toBe('active')
      expect(result.user_id).toBe(1)
    });


    it('index method should return a list of orders', async () => {
      const result = await ostore.index();
      
      expect(result[0].status).toBe('active')
      expect(result[0].user_id).toBe(1)
    });

    it('show method should return the correct orders', async () => {
      const result = await ostore.show('1');
      
      expect(result.status).toBe('active')
      expect(result.user_id).toBe(1)
      
    });

    it('adding product to order', async () => {
        const result = await ostore.addProduct(po);
        expect(result.order_id).toBe(1)
        expect(result.product_id).toBe(1)
        expect(result.quantity).toBe(20);
        
      });

    it('delete method should remove the orders', async () => {
      ostore.delete('1');
      const result = await ostore.index();
      expect(result).not.toBeNull;
    });
  });
});
