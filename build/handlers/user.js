"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../middlewares/auth");
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const store = new user_1.UserStore();
const index = async (__req, res) => {
    const users = await store.index();
    if (!users.length) {
        res.status(404).json({ message: 'no users are found!' });
    }
    res.json(users);
};
const show = async (req, res) => {
    try {
        const user = await store.show(req.params.id);
        if (user) {
            res.json({
                msg: 'user found !',
                user: { ...user },
            });
        }
        else {
            res.status(404).json({
                msg: 'user not found!',
            });
        }
    }
    catch (err) {
        res.json({
            msg: 'there is an error',
            err,
        });
    }
};
const create = async (req, res) => {
    try {
        const user = {
            id: req.body.id,
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password,
        };
        const newUser = await store.create(user);
        res.json({
            msg: 'User created',
            user: { ...newUser },
        });
    }
    catch (err) {
        res.status(400);
        res.json({ msg: `can't create user` });
    }
};
const update = async (req, res) => {
    try {
        const user = {
            id: req.body.id,
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password,
        };
        const edited = await store.edit(user, req.params.id);
        res.json({
            msg: 'updated!',
            user: { ...edited },
        });
    }
    catch (err) {
        res.status(400).json('msg:something went wrong while updating !');
    }
};
const destroy = async (req, res) => {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
};
const authenticate = async (req, res) => {
    try {
        const user = {
            id: req.body.id,
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password: req.body.password,
        };
        const auth = await store.authenticate(user.username, user.password);
        //edited
        const token = jsonwebtoken_1.default.sign({ auth }, process.env.TOKEN_KEY);
        if (!auth) {
            return res.status(401).json({
                message: 'the username or password is invalid',
            });
        }
        else {
            return res.status(200).json({
                status: 'success',
                message: 'the user has ben authorized successfully',
                user: { ...auth, token }, //we can hide the token for more scurity
            });
        }
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const usersRoutes = (app) => {
    app.get('/users', auth_1.authvalidator, index);
    app.post('/signin', authenticate);
    app.put('/users/:id', update);
    app.get('/users/:id', auth_1.authvalidator, show);
    app.post('/signup', create);
    app.delete('/users/:id', auth_1.authvalidator, destroy);
};
exports.default = usersRoutes;
