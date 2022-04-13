"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStore = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("../middlewares/auth");
dotenv_1.default.config();
const pepper = process.env.BCRYPT_PASSWORD;
//CRUD actions for users table
class UserStore {
    async index() {
        try {
            // @ts-ignore
            const conn = await db_1.default.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }
    async authenticate(username, password) {
        // @ts-ignore
        const conn = await db_1.default.connect();
        const sql = 'SELECT password FROM users WHERE username=($1)';
        const result = await conn.query(sql, [username]);
        const userInfo = await conn.query('SELECT * FROM users WHERE username=($1)', [username]);
        conn.release();
        if (result.rows.length) {
            const pass = result.rows[0];
            const user = userInfo.rows[0];
            if (bcrypt_1.default.compareSync(password + pepper, pass.password)) {
                return user;
            }
        }
        return null;
    }
    async show(id) {
        try {
            const sql = 'SELECT * FROM users WHERE id=($1)';
            // @ts-ignore
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            //const {...d} = result.rows[0];
            //nconsole.log(d.username);
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`);
        }
    }
    async create(u) {
        try {
            // @ts-ignore
            const conn = await db_1.default.connect();
            const sql = 'INSERT INTO users (username, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *;';
            const result = await conn.query(sql, [
                u.username,
                u.first_name,
                u.last_name,
                (0, auth_1.hash)(u.password),
            ]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not add new user or username is already in use ${u.username}. Error: ${err}`);
        }
    }
    async edit(u, id) {
        try {
            // @ts-ignore
            const conn = await db_1.default.connect();
            const sql = 'UPDATE users SET username=$1, first_name=$2, last_name=$3, password=$4 WHERE id=($5) RETURNING *;';
            const result = await conn.query(sql, [
                u.username,
                u.first_name,
                u.last_name,
                (0, auth_1.hash)(u.password),
                id,
            ]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not edit user ${u.first_name}${u.last_name}. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const sql = 'DELETE FROM users WHERE id=($1)';
            // @ts-ignore
            const conn = await db_1.default.connect();
            const result = await conn.query(sql, [id]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not delete user ${id}. Error: ${err}`);
        }
    }
}
exports.UserStore = UserStore;
