/* eslint-disable @typescript-eslint/ban-ts-comment */
import supertest from 'supertest';
import app from '../../app';
import Client from '../../db';

const request = supertest(app);

let token: string;
describe('Test endpoint & CRUD users', () => {
  afterAll(async () => {
    // @ts-ignore
    const conn = await Client.connect();
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
    it('index', async () => {
      const response = await request.get('/users');
      expect(response.status).toBe(401); //no token
    });

    it('getone', async () => {
      const response = await request.get('/users/1');
      expect(response.status).toBe(401); //no token
    });

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
      const response = await request
        .get('/users')
        .set('authorization', `Bearer ${token}`)
        .send({ user_auth_id: 1 });
      expect(response.status).toBe(200); //token
    });

    it('getone', async () => {
      const response = await request
        .get('/users/1')
        .set('authorization', `Bearer ${token}`)
        .send({ user_auth_id: 1 });
      expect(response.status).toBe(200);
      expect(response.body.user.username).toBe('avicii'); //token
    });

    it('update', async () => {
      const response = await request
        .put('/users/1')
        .set('authorization', `Bearer ${token}`)
        .send({
          user_auth_id: 1,
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
        .set('authorization', `Bearer ${token}`)
        .send({ user_auth_id: 1 });
      expect(response.status).toBe(200);
      expect(response.body).toBeNull; //token
    });
  });
});
