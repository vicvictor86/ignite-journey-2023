import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']),
  PORT: z.coerce.number().default(3333),
});

const tempEnv = envSchema.safeParse(process.env);

if (tempEnv.success === false) {
  console.error('Invalid environment variable', tempEnv.error.format());

  throw new Error('Invalid environment variable');
}

export const env = tempEnv.data;
