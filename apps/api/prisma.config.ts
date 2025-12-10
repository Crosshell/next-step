import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';
import { PrismaConfig } from 'prisma';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
}) satisfies PrismaConfig;
