import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './handlers/user';
import productsRoutes from './handlers/product';
import ordersRoutes from './handlers/order';
import DashboardService from './handlers/orderProduct';

const app: express.Application = express();
const address = 'http://localhost:3000/welcome';

app.use(bodyParser.json());
//TODO loop or map on data to change it's shape
app.get('/welcome', (__req: express.Request, res: express.Response) => {
  res.send(
    '<p><h1 style="color:blue";>welcome to our store ! 🎉</h1>\nFollow the instructions at the readme file 📧</p>'
  );
});

app.listen(3000, () => {
  console.log(`starting app on: ${address}`);
});

usersRoutes(app);
productsRoutes(app);
ordersRoutes(app);
DashboardService(app);

export default app;
