import dotenv from 'dotenv';
dotenv.config();

import { initDatabase, seedMemoryStore } from '../db/db';

async function runSeed() {
  console.log('--- Starting Hanif Centre Database Seed Script ---');
  try {
    await initDatabase();
    await seedMemoryStore();
    console.log('✅ Hanif Centre Database Seed completed successfully!');
    console.log('Admin Email:', process.env.ADMIN_EMAIL || 'admin@hanifcentre.com');
    console.log('Seeded 95+ realistic electronics products across 18 categories.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database seed error:', err);
    process.exit(1);
  }
}

runSeed();
