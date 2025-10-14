import { Router } from 'express';
import { signup } from '../controllers/auth.controller';
import { login } from '../controllers/auth.controller';

const authRouter: Router = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);

export default authRouter;



