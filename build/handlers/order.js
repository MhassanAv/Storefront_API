"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const auth_1 = require("../middlewares/auth");
const store = new order_1.orderStore();
const index = async (_req, res) => {
    const orders = await store.index();
    if (!orders.length) {
        res.status(404).json({ message: 'no orders are found!' });
    }
    res.json(orders);
};
const show = async (req, res) => {
    try {
        const order = await store.show(req.params.id);
        if (order) {
            res.json({
                msg: 'order found !',
                order: { ...order },
            });
        }
        else {
            res.status(404).json({
                msg: 'order not found!',
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
        const order = {
            id: req.body.id,
            status: req.body.status,
            user_id: req.body.user_auth_id,
        };
        const newOrder = await store.create(order);
        res.json({
            msg: 'order created',
            order: { ...newOrder },
        });
    }
    catch (err) {
        res.status(400);
        res.json({ msg: 'can not create order' });
    }
};
const update = async (req, res) => {
    try {
        const order = {
            id: req.body.id,
            status: req.body.status,
            user_id: req.body.user_auth_id,
        };
        const edited = await store.edit(order, req.params.id);
        res.json({
            user_auth_id: req.body.user_auth_id,
            msg: 'updated!',
            order: { ...edited },
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
const addProduct = async (req, res) => {
    const orderProduct = {
        order_id: parseInt(req.params.ido),
        product_id: parseInt(req.params.idp),
        quantity: req.body.quantity,
    };
    const addedProduct = await store.addProduct(orderProduct);
    res.json(addedProduct);
};
const ordersRoutes = (app) => {
    app.get('/orders', auth_1.authvalidator, index);
    app.put('/orders/:id', auth_1.authvalidator, update);
    app.get('/orders/:id', auth_1.authvalidator, show);
    app.post('/orders', auth_1.authvalidator, create);
    app.post('/orders/:ido/products/:idp', auth_1.authvalidator, addProduct);
    app.delete('/orders/:id', auth_1.authvalidator, destroy);
};
exports.default = ordersRoutes;
