"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderProducts = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const db_1 = __importDefault(require("../db"));
//getting all orders in store in detail by joining 3 tables to get all data required
class orderProducts {
    async allOrders() {
        try {
            //@ts-ignore
            const conn = await db_1.default.connect();
            const result = await conn.query(`SELECT user_id, username, order_id, status, name, price, Product_id ,quantity FROM products INNER JOIN orderProducts ON products.id = orderProducts.product_id INNER JOIN orders ON orders.id = orderProducts.order_id INNER JOIN users on users.id = orders.user_id WHERE price IS NOT NULL`);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`unable get products and orders: ${err}`);
        }
    }
    async activeOrders() {
        try {
            //@ts-ignore
            const conn = await db_1.default.connect();
            const result = await conn.query(`SELECT user_id, username, order_id, status, name, price ,quantity FROM products RIGHT JOIN orderProducts ON products.id = orderProducts.product_id RIGHT JOIN orders ON orders.id = orderProducts.order_id LEFT JOIN users on users.id = orders.user_id WHERE status ='active'`);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`unable get products and orders: ${err}`);
        }
    }
    async Orders(id) {
        try {
            //@ts-ignore
            const conn = await db_1.default.connect();
            const result = await conn.query(`SELECT user_id, username, order_id, status, name, price ,quantity FROM products RIGHT JOIN orderProducts ON products.id = orderProducts.product_id RIGHT JOIN orders ON orders.id = orderProducts.order_id LEFT JOIN users on users.id = orders.user_id WHERE orders.id =($1)`, [parseInt(id)]);
            conn.release();
            const order = {
                id: result.rows[0].order_id,
                order_status: result.rows[0].status,
                username: result.rows[0].username,
                order_items: result.rows.map((row) => ({
                    name: row.name,
                    id: row.Product_id,
                    price: row.price,
                    quantity: row.quantity,
                })),
            };
            return [order];
        }
        catch (err) {
            throw new Error(`unable get products and orders: ${err}`);
        }
    }
}
exports.orderProducts = orderProducts;
