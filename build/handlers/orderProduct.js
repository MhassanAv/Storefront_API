'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const auth_1 = require('../middlewares/auth');
const orderProduct_1 = require('../services/orderProduct');
const dashBoard = new orderProduct_1.orderProducts();
//getting all orders in store in detail
const productsInOrders = async (_req, res) => {
  try {
    const orderDetails = await dashBoard.allOrders();
    res.json(orderDetails);
  } catch (error) {
    res.status(400).json({ massage: 'error!' });
  }
};
//getting all active orders
const activeOrders = async (_req, res) => {
  try {
    const orderDetails = await dashBoard.activeOrders();
    res.json(orderDetails);
  } catch (error) {
    res.status(400).json({ massage: 'error!' });
  }
};
//getting orders of a certain orderId by id
const Orders = async (_req, res) => {
  try {
    const data = await dashBoard.Orders(_req.params.id);
    if (!data) {
      res.json({ msg: `no orders yet from user !${_req.params.id}` });
      return;
    }
    res.json(data);
  } catch (error) {
    res.status(400).json({ massage: 'error!' });
  }
};
const DashboardService = (app) => {
  app.get('/order/list', auth_1.authvalidator, productsInOrders);
  app.get('/activeorders', auth_1.authvalidator, activeOrders);
  app.get('/order/:id', auth_1.authvalidator, Orders);
};
exports.default = DashboardService;
