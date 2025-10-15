import { Router } from 'express';
import { signup, login, me } from '../controllers/auth.controller';
import { asyncHandler } from '../middlewares/async.handler';
import authMiddleware from '../middlewares/auth';

const authRouter: Router = Router();

authRouter.post('/signup', asyncHandler(signup));
authRouter.post('/login', asyncHandler(login));
authRouter.get('/me', [authMiddleware], asyncHandler(me));

export default authRouter;



