import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '..'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { BadRequestsException } from '../exceptions/bad.requests';
import { ErrorCode } from '../exceptions/root';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    let user = await prismaClient.user.findFirst({
      where: { email },
    })
    if (user) {
      next(new BadRequestsException('User already exists', ErrorCode.USER_ALREADY_EXISTS));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prismaClient.user.create({
      data: {
          name, 
          email,
          password: hashedPassword 
      }
    })
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error'});
  }
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({
    where: { email },
  })
  if (!user) {
    return res.status(401).json({ message: 'User does not exist.'})
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password.' });
  }

  const token = jwt.sign({
    userId: user.id,
    email: user.email
  }, JWT_SECRET,
  { expiresIn: '1h' }
  );

  return res.status(200).json({ user, token });
}