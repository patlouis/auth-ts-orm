import express, { Express } from 'express';
import { PORT } from './secrets';
import rootRouter from './routes/index';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';

const app: Express = express();

app.use(express.json());
app.use('/api', rootRouter);

export const prismaClient = new PrismaClient({
  log: ['query']
});

app.use(errorMiddleware);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});