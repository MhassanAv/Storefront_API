'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
/* eslint-disable @typescript-eslint/ban-ts-comment */
const supertest_1 = __importDefault(require('supertest'));
const app_1 = __importDefault(require('../../app'));
const db_1 = __importDefault(require('../../db'));
const request = (0, supertest_1.default)(app_1.default);
describe('Test endpoint & CRUD', () => {
  afterAll(async () => {
    // @ts-ignore
    const conn = await db_1.default.connect();
    await conn.query('ALTER SEQUENCE orderProducts_id_seq RESTART WITH 1');
    await conn.query('DELETE FROM orderProducts');
    conn.release();
  });
  describe('Test endpoint responses', () => {
    describe('Security testing', () => {
      it('get all', async () => {
        const response = await request.get('/order/list');
        expect(response.status).toBe(401); //no token
      });
      it('get active', async () => {
        const response = await request.get('/activeorders');
        expect(response.status).toBe(401); //no token
      });
      it('get one', async () => {
        const response = await request.get('/order/1');
        expect(response.status).toBe(401); //no token
      });
    });
  });
});
