import 'dotenv/config';
import { Pool } from 'pg';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    const pool = new Pool({
      connectionString: databaseUrl,
      // SSL configuration: only enable for production or remote databases
      ssl:
        process.env.NODE_ENV === 'production' ||
        databaseUrl.includes('rds.amazonaws.com')
          ? {
              rejectUnauthorized: false, // For AWS RDS without certificate verification
            }
          : false, // Disable SSL for local development
      // Connection pool configuration
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
      connectionTimeoutMillis: 5000, // Return error if connection takes longer than 5 seconds
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    console.log('Connecting to the database...');
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    console.log('Disconnecting from the database...');
    await this.$disconnect();
  }
}
