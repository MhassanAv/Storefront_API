/* eslint-disable @typescript-eslint/ban-ts-comment */
import supertest from 'supertest';
import app from '../../app';
import Client from '../../db';



const request = supertest(app);

describe('Test endpoint & CRUD', () => {

afterAll(async () => {
    // @ts-ignore
    const conn = await Client.connect();
    await conn.query('ALTER SEQUENCE orderProducts_id_seq RESTART WITH 1');
    await conn.query('DELETE FROM orderProducts');
    conn.release();
  });

describe('Test endpoint responses', () => {



  describe('Security testing', () => {
  
  it('get all', async () => {
    const response = await request.get('/order/list')
      expect(response.status).toBe(401) //no token
  });

  it('get active', async () => {
    const response = await request.get('/activeorders')
      expect(response.status).toBe(401) //no token
  });


  it('get one', async () => {
    const response = await request.get('/order/1')
      expect(response.status).toBe(401) //no token
  });

  
});

});

});
