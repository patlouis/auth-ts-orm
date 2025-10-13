import { Request, Response } from 'express';
import { prismaClient } from '..'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if(!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }

  let user = await prismaClient.user.findFirst({
    where: { email },
  })
  if (user) {
    return res.status(400).json({ message: 'User already exists.' });
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
}

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

    if(!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  
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