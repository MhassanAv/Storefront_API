'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.orderStore = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const db_1 = __importDefault(require('../db'));
//CRUD actions for orders table
class orderStore {
  async index() {
    try {
      // @ts-ignore
      const conn = await db_1.default.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }
  async show(id) {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      // @ts-ignore
      const conn = await db_1.default.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }
  async create(o) {
    try {
      // @ts-ignore
      const conn = await db_1.default.connect();
      const sql =
        'INSERT INTO orders (status,user_id) VALUES($1, $2) RETURNING *;';
      const result = await conn.query(sql, [o.status, o.user_id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not add new order . Error: ${err}`);
    }
  }
  async addProduct(opr) {
    try {
      // @ts-ignore
      const conn = await db_1.default.connect();
      const sql =
        'INSERT INTO orderProducts (order_id,Product_id,quantity) VALUES($1, $2, $3) RETURNING *;';
      const result = await conn.query(sql, [
        opr.order_id,
        opr.product_id,
        opr.quantity,
      ]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add add product to order Error: ${err}`);
    }
  }
  async edit(o, id) {
    try {
      // @ts-ignore
      const conn = await db_1.default.connect();
      const sql =
        'UPDATE orders SET status=$1, user_id=$2 WHERE id=($3) RETURNING *;';
      const result = await conn.query(sql, [o.status, o.user_id, id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not edit order ${id}. Error: ${err}`);
    }
  }
  async delete(id) {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1)';
      // @ts-ignore
      const conn = await db_1.default.connect();
      const result = await conn.query(sql, [id]);
      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }
}
exports.orderStore = orderStore;
