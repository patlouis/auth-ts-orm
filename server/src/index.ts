import express, { Express, Request, Response } from 'express';
import { PORT } from './secrets';

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
  res.send('Hi mom!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});