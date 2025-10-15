import { Router } from 'express';
import { signup } from '../controllers/auth.controller';
import { login } from '../controllers/auth.controller';
import { asyncHandler } from '../middlewares/async.handler';

const authRouter: Router = Router();

authRouter.post('/signup', asyncHandler(signup));
authRouter.post('/login', asyncHandler(login));

export default authRouter;



