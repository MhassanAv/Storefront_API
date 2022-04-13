/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import Client from '../db';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { hash } from '../middlewares/auth';

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD as string;

export type user = {
  id:number;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
};

//CRUD actions for users table

export class UserStore {
  
  async index(): Promise<user[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<user | null> {
    // @ts-ignore
    const conn = await Client.connect();
    const sql = 'SELECT password FROM users WHERE username=($1)';

    const result = await conn.query(sql, [username]);
    const userInfo = await conn.query(
      'SELECT * FROM users WHERE username=($1)',
      [username]
    );

    conn.release();

    if (result.rows.length) {
      const pass = result.rows[0];
      const user = userInfo.rows[0];

      if (bcrypt.compareSync(password + pepper, pass.password)) {
        return user;
      }
    }

    return null;
  }

  async show(id: string): Promise<user> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      //const {...d} = result.rows[0];
      //nconsole.log(d.username);
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(u: user): Promise<user> {
    try {
      // @ts-ignore
      const conn = await Client.connect();

      const sql =
        'INSERT INTO users (username, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *;';

      const result = await conn.query(sql, [
        u.username,
        u.first_name,
        u.last_name,
        hash(u.password),
      ]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(
        `Could not add new user or username is already in use ${u.username}. Error: ${err}`
      );
    }
  }

  async edit(u: user, id: string): Promise<user> {
    try {
      // @ts-ignore
      const conn = await Client.connect();

      const sql =
        'UPDATE users SET username=$1, first_name=$2, last_name=$3, password=$4 WHERE id=($5) RETURNING *;';

      const result = await conn.query(sql, [
        u.username,
        u.first_name,
        u.last_name,
        hash(u.password),
        id,
      ]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(
        `Could not edit user ${u.first_name}${u.last_name}. Error: ${err}`
      );
    }
  }

  async delete(id: string): Promise<user> {
    try {
      const sql = 'DELETE FROM users WHERE id=($1)';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }
}
