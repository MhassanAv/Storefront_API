"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productStore = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const db_1 = __importDefault(require("../db"));
//CRUD actions for products table table
class productStore {
    async index() {
        try {
            // @ts-ignore
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)';
            // @ts-ignore
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err}`);
        }
    }
    async create(p) {
        try {
            // @ts-ignore
            const conn = await db_1.default.connect();
            const sql = 'INSERT INTO products (name,price) VALUES($1, $2) RETURNING *;';
            const result = await conn.query(sql, [p.name, p.price]);
            const products = result.rows[0];
            conn.release();
            return products;
        }
        catch (err) {
            throw new Error(`Could not add new product or product already exists in store ${p.name}. Error: ${err}`);
        }
    }
    async edit(p, id) {
        try {
            // @ts-ignore
            const conn = await db_1.default.connect();
            const sql = 'UPDATE products SET name=$1, price=$2 WHERE id=($3) RETURNING *;';
            const result = await conn.query(sql, [p.name, p.price, id]);
            const product = result.rows[0];
            conn.release();
            return product;
        }
        catch (err) {
            throw new Error(`Could not edit product ${p.name}. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM products WHERE id=($1)';
            // @ts-ignore
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            const product = result.rows[0];
            conn.release();
            return product;
        }
        catch (err) {
            throw new Error(`Could not delete product ${id}. Error: ${err}`);
        }
    }
}
exports.productStore = productStore;
