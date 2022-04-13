"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/ban-ts-comment */
const db_1 = __importDefault(require("../../db"));
const product_1 = require("../product");
const store = new product_1.productStore();
describe('Products Model', () => {
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('should have a update method', () => {
        expect(store.edit).toBeDefined();
    });
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    afterAll(async () => {
        // @ts-ignore
        const conn = await db_1.default.connect();
        await conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1');
        await conn.query('DELETE FROM products');
        conn.release();
    });
    describe('CRUD', () => {
        it('create method should add a product', async () => {
            const result = await store.create({
                name: "iphone 12",
                price: "$700"
            });
            expect(result.name).toBe('iphone 12');
            expect(result.price).toBe('$700');
        });
        it('index method should return a list of products', async () => {
            const result = await store.index();
            expect(result[0].name).toBe('iphone 12');
            expect(result[0].price).toBe('$700');
        });
        it('show method should return the correct products', async () => {
            const result = await store.show('1');
            expect(result.name).toBe('iphone 12');
            expect(result.price).toBe('$700');
        });
        it('delete method should remove the products', async () => {
            store.delete('1');
            const result = await store.index();
            expect(result).not.toBeNull;
        });
    });
});
