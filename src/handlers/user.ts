import express, { Request, Response } from 'express';
import { user, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import { authvalidator } from '../middlewares/auth';

export let token: string;

const store = new UserStore();

const index = async (__req: Request, res: Response) => {
  const users = await store.index();
  if (!users.length) {
    res.status(404).json({ message: 'no users are found!' });
  }
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.id);
    if (user) {
      res.json({
        msg: 'user found !',
        user: { ...user },
      });
    } else {
      res.status(404).json({
        msg: 'user not found!',
      });
    }
  } catch (err) {
    res.json({
      msg: 'there is an error',
      err,
    });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const user: user = {
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
  } catch (err) {
    res.status(400);
    res.json({ msg: `can't create user` });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const user: user = {
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
  } catch (err) {
    res.status(400).json('msg:something went wrong while updating !');
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.params.id);
  res.json(deleted);
};
const authenticate = async (req: Request, res: Response) => {
  try {
    const user: user = {
      username: req.body.username,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
    };
    const auth = await store.authenticate(user.username, user.password);
    //edited
    token = jwt.sign({ auth }, process.env.TOKEN_KEY as string);
    if (!auth) {
      return res.status(401).json({
        message: 'the username or password is invalid',
      });
    } else {
      return res.status(200).json({
        status: 'success',
        message: 'the user has ben authorized successfully',
        user: { ...auth, token }, //we can hide the token for more scurity
      });
    }
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const usersRoutes = (app: express.Application) => {
  app.get('/users', authvalidator, index);
  app.post('/signin', authenticate);
  app.put('/users/:id', update);
  app.get('/users/:id', authvalidator, show);
  app.post('/signup', create);
  app.delete('/users/:id', authvalidator, destroy);
};

export default usersRoutes;
