import { Request, Response, NextFunction} from 'express';
import { UnauthorizedException } from '../exceptions/unauthorized';
import { ErrorCode } from '../exceptions/root';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { prismaClient } from '..';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if(!token) {
        throw new UnauthorizedException('No token provided', ErrorCode.UNAUTHORIZED);
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET) as any;
        const user = await prismaClient.user.findFirst({
            where: { id: (payload.userId)}
        })
        if(!user) {
            throw new UnauthorizedException('User not found', ErrorCode.UNAUTHORIZED);
        } 
        req.user = user;
        next();
    } catch(error) {
        throw new UnauthorizedException('Invalid token', ErrorCode.UNAUTHORIZED);
    }
}

export default authMiddleware;