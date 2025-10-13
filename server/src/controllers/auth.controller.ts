import { Request, Response } from 'express';
import { prismaClient } from '..'
import bcrypt from 'bcrypt';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  let user = await prismaClient.user.findFirst({
    where: {email}
  })
  if (user) {
    throw Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user = await prismaClient.user.create({
    data: {
        name, 
        email,
        password: hashedPassword 
    }
  })
  res.json(user);
}