import { Router } from 'express';
import { createProduct } from '../controllers/product.controller';
import { asyncHandler } from '../middlewares/async.handler';
import authMiddleware from '../middlewares/auth';

const productRouter: Router = Router();

productRouter.post('/create', [authMiddleware], asyncHandler(createProduct));

export default productRouter;

