import express, { Request, Response } from 'express';
import { order, orderProduct, orderStore } from '../models/order';
import { authvalidator } from '../middlewares/auth';

const store = new orderStore();

const index = async (_req: Request, res: Response) => {
  const orders = await store.index();
  if (!orders.length) {
    res.status(404).json({ message: 'no orders are found!' });
  }
  res.json(orders);
};

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(req.params.id);
    if (order) {
      res.json({
        msg: 'order found !',
        order: { ...order },
      });
    } else {
      res.status(404).json({
        msg: 'order not found!',
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
    const order: order = {
      status: req.body.status,
      user_id: req.body.user_auth_id,
    };

    const newOrder = await store.create(order);
    res.json({
      msg: 'order created',
      order: { ...newOrder },
    });
  } catch (err) {
    res.status(400);
    res.json({ msg: 'can not create order' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const order: order = {
      status: req.body.status,
      user_id: req.body.user_auth_id,
    };
    const edited = await store.edit(order, req.params.id);
    res.json({
      user_auth_id: req.body.user_auth_id,
      msg: 'updated!',
      order: { ...edited },
    });
  } catch (err) {
    res.status(400).json('msg:something went wrong while updating !');
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.params.id);
  res.json(deleted);
};

const addProduct = async (req: Request, res: Response) => {
  const orderProduct: orderProduct = {
    order_id: parseInt(req.params.ido),
    product_id: parseInt(req.params.idp),
    quantity: req.body.quantity,
  };
  const addedProduct = await store.addProduct(orderProduct);
  res.json(addedProduct);
};

const ordersRoutes = (app: express.Application) => {
  app.get('/orders', authvalidator, index);
  app.put('/orders/:id', authvalidator, update);
  app.get('/orders/:id', authvalidator, show);
  app.post('/orders', authvalidator, create);
  app.post('/orders/:ido/products/:idp', authvalidator, addProduct);
  app.delete('/orders/:id', authvalidator, destroy);
};

export default ordersRoutes;
