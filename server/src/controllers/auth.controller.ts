import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '..'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';

import { ErrorCode } from '../exceptions/root';
import { BadRequestsException } from '../exceptions/bad.requests';
import { UnprocessableEntity } from '../exceptions/validation';
import { NotFoundException } from '../exceptions/not.found';

import { SignUpSchema } from '../schema/users';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    SignUpSchema.parse(req.body);
    const { name, email, password } = req.body;

    let user = await prismaClient.user.findFirst({
      where: { email },
    })
    if (user) {
      return next(new BadRequestsException('User already exists', ErrorCode.USER_ALREADY_EXISTS));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await prismaClient.user.create({
      data: {
          name, 
          email,
          password: hashedPassword 
      }
    })
    return res.status(201).json(user);
  } catch (err: any) {
    return next(new UnprocessableEntity('Unprocessable Entity', ErrorCode.UNPROCESSABLE_ENTITY, err?.issues))
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({
      where: { email },
    });
    if (!user) {
      return next(new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND));
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
  } catch(err: any) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
}