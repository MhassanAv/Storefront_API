import express, { Request, Response } from 'express';
import { product, productStore } from '../models/product';
import { authvalidator } from '../middlewares/auth';

const store = new productStore();

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  if (!products.length) {
    res.status(404).json({ message: 'no products are found!' });
  }
  res.json(products);
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(req.params.id);
    if (product) {
      res.json({
        msg: 'product found !',
        product: { ...product },
      });
    } else {
      res.status(404).json({
        msg: 'prodcut not found!',
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
    const product: product = {
      name: req.body.name,
      price: req.body.price,
    };

    const newProduct = await store.create(product);
    res.json({
      msg: 'Product created',
      product: { ...newProduct },
    });
  } catch (err) {
    res.status(400);
    res.json({ msg: 'can not create product' });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const product: product = {
      name: req.body.name,
      price: req.body.price,
    };
    const edited = await store.edit(product, req.params.id);
    res.json({
      user_auth_id: req.body.user_auth_id,
      msg: 'updated!',
      product: { ...edited },
    });
  } catch (err) {
    res.status(400).json('msg:something went wrong while updating !');
  }
};

const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.params.id);
  res.json(deleted);
};

const productsRoutes = (app: express.Application) => {
  app.get('/products', authvalidator, index);
  app.put('/products/:id', authvalidator, update);
  app.get('/products/:id', authvalidator, show);
  app.post('/products', authvalidator, create);
  app.delete('/products/:id', authvalidator, destroy);
};

export default productsRoutes;
