import { z } from 'zod';

export const SignUpSchema = z.object({
    name: z.string(),
    email: z.string().regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Invalid email address"
    ),
    password: z.string().min(6)
})