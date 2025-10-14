import express, { Express, Request, Response } from 'express';
import { PORT } from './secrets';
import rootRouter from './routes/index';
import { PrismaClient } from '@prisma/client';
import { SignUpSchema } from './schema/users';
import { errorMiddleware } from './middlewares/errors';

const app: Express = express();

app.use(express.json());
app.use('/api', rootRouter)

export const prismaClient = new PrismaClient({
  log: ['query']
}).$extends({
  query: {
    user: {
      create({ args, query}) {
        args.data = SignUpSchema.parse(args.data)
        return query(args)
      }
    }
  }
})

app.use(errorMiddleware);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});