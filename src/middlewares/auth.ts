import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { token } from '../handlers/user'; // accessing token after login

dotenv.config();
//password hashing
export const hash = (password: string): string => {
  const pepper = process.env.BCRYPT_PASSWORD as string;
  const saltRound = process.env.SALT_ROUNDS as string;
  const hashed = bcrypt.hashSync(password + pepper, parseInt(saltRound));
  return hashed;
};
//validating user after validating hashed password
//user_auth_id should be passed in every request in body to make sure that the user id
// of decoded token is the same as current user id
export const authvalidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.headers['Authorization'] = `Bearer ${token}`; //adding token to http header instead of doing it maunally
    const authHeader = req.headers.Authorization;
    if (authHeader == null) {
      res.status(401).json({ message: 'Unauthorized' });
    }
    if (authHeader != null) {
      const bearer = authHeader.split(' ')[0].toLowerCase();
      const token = authHeader.split(' ')[1];
      if (token && bearer === 'bearer') {
        const decoded = jwt.verify(
          token,
          process.env.TOKEN_KEY as unknown as string
        );
        const userId: number = JSON.parse(JSON.stringify(decoded)).auth.id;
        if (decoded != null && userId === req.body.user_auth_id) {
          res.status(200);
          next();
        }
        if (userId != req.body.user_auth_id) {
          res.status(401).json({ message: 'Unauthorized : id does not match' });
        }
      }
    }
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
