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
let token;
describe('Test endpoint & CRUD users', () => {
  afterAll(async () => {
    // @ts-ignore
    const conn = await db_1.default.connect();
    await conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await conn.query('DELETE FROM users');
    conn.release();
  });
  describe('Test endpoint responses of users', () => {
    it('create user endpoint', async () => {
      const response = await request.post('/signup').send({
        username: 'avicii',
        first_name: 'any',
        last_name: 'any',
        password: 'ok',
      });
      expect(response.status).toBe(200);
      expect(response.body.user.id).toEqual(1);
      expect(response.body.user.username).toEqual('avicii');
      expect(response.body.user.first_name).toEqual('any');
      expect(response.body.user.last_name).toEqual('any');
      expect(response.body.user.password).not.toBeNull;
    });
    it('authorization', async () => {
      const response = await request.post('/signin').send({
        username: 'avicii',
        first_name: 'any',
        last_name: 'any',
        password: 'ok',
      });
      expect(response.status).toBe(200);
      expect(response.body.user.id).toEqual(1);
      expect(response.body.user.username).toEqual('avicii');
      expect(response.body.user.first_name).toEqual('any');
      expect(response.body.user.last_name).toEqual('any');
      expect(response.body.user.password).not.toBeNull;
      expect(response.body.user.token).not.toBeNull;
      token = response.body.user.token;
    });
  });
  describe('Security testing', () => {
    it('update', async () => {
      const response = await request.put('/users/1').send({
        username: 'avicii',
        first_name: 'an',
        last_name: 'any',
        password: 'ok',
      });
      expect(response.status).toBe(401); //no token
    });
    it('delete', async () => {
      const response = await request.delete('/users/1');
      expect(response.status).toBe(401); //no token
    });
  });
  describe('CRUD functionality testing', () => {
    it('index', async () => {
      const response = await request.get('/users');
      expect(response.status).toBe(200);
    });
    it('getone', async () => {
      const response = await request.get('/users/1');
      expect(response.status).toBe(200);
      expect(response.body.user.username).toBe('avicii'); //token
    });
    it('update', async () => {
      const response = await request
        .put('/users/1')
        .set('authorization', `Bearer ${token}`)
        .send({
          username: 'avicii',
          first_name: 'an',
          last_name: 'any',
          password: 'ok',
        });
      expect(response.status).toBe(200);
      expect(response.body.user.first_name).toBe('an'); //token
    });
    it('delete', async () => {
      const response = await request
        .delete('/users/1')
        .set('authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toBeNull; //token
    });
  });
});
