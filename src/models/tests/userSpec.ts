/* eslint-disable @typescript-eslint/ban-ts-comment */
import { UserStore } from '../user';
import Client from '../../db';

const store = new UserStore();

describe('User Model', () => {
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
  it('should have a authenticate method', () => {
    expect(store.authenticate).toBeDefined();
  });

  afterAll(async () => {
    // @ts-ignore
    const conn = await Client.connect();
    await conn.query('ALTER SEQUENCE user_id_seq RESTART WITH 1');
    await conn.query('DELETE FROM users');
    conn.release();
  });

  describe('CRUD and authenticate methods', () => {
    it('create method should add a book', async () => {
      const result = await store.create({
        username: 'avicii',
        first_name: 'any',
        last_name: 'any',
        password: 'ok',
      });
      expect(result).toEqual({
        username: 'avicii',
        first_name: 'any',
        last_name: 'any',
        password: 'ok',
      });
    });

    it('should authenticate user', async () => {
      const result = await store.authenticate('avicii', 'ok');
      expect(result).not.toBeNull;
    });

    it('index method should return a list of users', async () => {
      const result = await store.index();
      expect(result).toEqual([
        {
          username: 'avicii',
          first_name: 'any',
          last_name: 'any',
          password: 'ok',
        },
      ]);
    });

    it('show method should return the correct user', async () => {
      const result = await store.show('1');
      expect(result).toEqual({
        username: 'avicii',
        first_name: 'any',
        last_name: 'any',
        password: 'ok',
      });
    });

    it('delete method should remove the user', async () => {
      store.delete('1');
      const result = await store.index();
      expect(result).toEqual([]);
    });
  });
});
