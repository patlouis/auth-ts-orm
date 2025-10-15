import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '..'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';

import { ErrorCode } from '../exceptions/root';
import { BadRequestsException } from '../exceptions/bad.requests';
import { NotFoundException } from '../exceptions/not.found';

import { SignUpSchema } from '../schema/users';
import { nextTick } from 'process';

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    SignUpSchema.parse(req.body);
    const { name, email, password } = req.body;

    let user = await prismaClient.user.findFirst({
      where: { email },
    })
    if (user) {
      throw new BadRequestsException('User already exists', ErrorCode.USER_ALREADY_EXISTS);
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
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestsException('Invalid password', ErrorCode.INVALID_PASSWORD);
    }

    const token = jwt.sign({
      userId: user.id,
      email: user.email
    }, JWT_SECRET,
    { expiresIn: '1h' }
    );

    return res.status(200).json({ user, token });
}