import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'teste', 'production']).default('development'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
});

export const env = envSchema.parse(process.env);
