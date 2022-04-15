'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const product_1 = require('../models/product');
const auth_1 = require('../middlewares/auth');
const store = new product_1.productStore();
const index = async (_req, res) => {
  const products = await store.index();
  if (!products.length) {
    res.status(404).json({ message: 'no products are found!' });
  }
  res.json(products);
};
const show = async (req, res) => {
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
const create = async (req, res) => {
  try {
    const product = {
      id: req.body.id,
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
const update = async (req, res) => {
  try {
    const product = {
      id: req.body.id,
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
const destroy = async (req, res) => {
  const deleted = await store.delete(req.params.id);
  res.json(deleted);
};
const productsRoutes = (app) => {
  app.get('/products', auth_1.authvalidator, index);
  app.put('/products/:id', auth_1.authvalidator, update);
  app.get('/products/:id', auth_1.authvalidator, show);
  app.post('/products', auth_1.authvalidator, create);
  app.delete('/products/:id', auth_1.authvalidator, destroy);
};
exports.default = productsRoutes;
