/* eslint-disable @typescript-eslint/ban-ts-comment */
import Client from '../db';

export type orderData = {
  order_id: number;
  username: string;
  user_id: number;
  status: string;
  order_items: [string | number];
};
//getting all orders in store in detail by joining 3 tables to get all data required

export class orderProducts {
  async allOrders(): Promise<orderData[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect();
      const result = await conn.query(
        `SELECT user_id, username, order_id, status, name, price, Product_id ,quantity FROM products INNER JOIN orderProducts ON products.id = orderProducts.product_id INNER JOIN orders ON orders.id = orderProducts.order_id INNER JOIN users on users.id = orders.user_id WHERE price IS NOT NULL`
      );
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`);
    }
  }

  async activeOrders(): Promise<orderData[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(
        `SELECT user_id, username, order_id, status, name, price ,quantity FROM products RIGHT JOIN orderProducts ON products.id = orderProducts.product_id RIGHT JOIN orders ON orders.id = orderProducts.order_id LEFT JOIN users on users.id = orders.user_id WHERE status ='active'`
      );

      conn.release();


      return result.rows;
      
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`);
    }
  }
  async Orders(id: string): Promise<orderData[]> {
    try {
      //@ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(
        `SELECT user_id, username, order_id, status, name, price ,quantity FROM products RIGHT JOIN orderProducts ON products.id = orderProducts.product_id RIGHT JOIN orders ON orders.id = orderProducts.order_id LEFT JOIN users on users.id = orders.user_id WHERE orders.id =($1)`,
        [parseInt(id)]
      );

      conn.release();

      const order: orderData = {
        order_id: result.rows[0].order_id,
        user_id: result.rows[0].user_id,
        status: result.rows[0].status,
        username: result.rows[0].username,
        order_items: result.rows.map(
          (row: {
            name: string;
            Product_id: number;
            price: string;
            quantity: number;
          }) => ({
            name: row.name,
            id: row.Product_id,
            price: row.price,
            quantity: row.quantity,
          })
        ),
      };

      return [order];
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`);
    }
  }
}
