import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  PORT: z.coerce.number().int().positive().default(5000),

  DATABASE_URL: z
    .string({
      error: 'Must be a valid database connection string',
    })
    .min(1),

  CLIENT_URL: z.url({
    error: 'Must be a valid web frontend URL',
  }),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const flattened = z.flattenError(result.error);

  console.error('❌ Invalid or missing environment variables:');
  console.error(flattened.fieldErrors);
  process.exit(1);
}

export const env = Object.freeze(result.data);

export type Env = z.infer<typeof envSchema>;
