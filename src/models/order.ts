/* eslint-disable @typescript-eslint/ban-ts-comment */
import Client from '../db';

export type order = {
  id: number;
  status: string;
  user_id: number;
};

export type orderProduct = {
  order_id: number;
  product_id: number;
  quantity: number;
};

//CRUD actions for orders table

export class orderStore {
  async index(): Promise<order[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: string): Promise<order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(o: order): Promise<order> {
    try {
      // @ts-ignore
      const conn = await Client.connect();

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

  async addProduct(opr: orderProduct): Promise<orderProduct> {
    try {
      // @ts-ignore
      const conn = await Client.connect();

      const sql =
        'INSERT INTO orderProducts (order_id,Product_id,quantity) VALUES($1, $2, $3) RETURNING *;';

      const result = await conn.query(sql, [
        opr.order_id,
        opr.product_id,
        opr.quantity
      ]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not add add product to order Error: ${err}`);
    }
  }

  async edit(o: order, id: string): Promise<order> {
    try {
      // @ts-ignore
      const conn = await Client.connect();

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

  async delete(id: string): Promise<order> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }
}
