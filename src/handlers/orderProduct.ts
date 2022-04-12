import express, { Request, Response } from 'express';
import { authvalidator } from '../middlewares/auth';
import { orderProducts } from '../services/orderProduct';

const dashBoard = new orderProducts();

//getting all orders in store in detail

const productsInOrders = async (_req: Request, res: Response) => {
  try {
    const orderDetails = await dashBoard.allOrders();
    res.json(orderDetails);
  } catch (error) {
    res.status(400).json({ massage: 'error!' });
  }
};

//getting all active orders
const activeOrders = async (_req: Request, res: Response) => {
  try {
    const orderDetails = await dashBoard.activeOrders();
    res.json(orderDetails);
  } catch (error) {
    res.status(400).json({ massage: 'error!' });
  }
};

//getting orders of a certain orderId by id
const Orders = async (_req: Request, res: Response) => {
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

const DashboardService = (app: express.Application) => {
  app.get('/order/list', authvalidator, productsInOrders);
  app.get('/activeorders', authvalidator, activeOrders);
  app.get('/order/:id', authvalidator, Orders);
};

export default DashboardService;
