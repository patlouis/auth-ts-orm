import { Request, Response } from 'express';
import { prismaClient } from '..';

export const createProduct = async (req: Request, res: Response) => {
    const product = await prismaClient.products.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(','),

        }
    })
    return res.status(201).json(product);
}