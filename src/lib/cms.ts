import fs from 'fs/promises';
import path from 'path';
import { sql } from '@vercel/postgres';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

export async function getCMSData() {
  // 1. Try Vercel Postgres (Production)
  if (process.env.POSTGRES_URL) {
    try {
      // Ensure table exists (Auto-Fix)
      await sql`CREATE TABLE IF NOT EXISTS cms_data (id VARCHAR(50) PRIMARY KEY, content JSONB, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
      
      const { rows } = await sql`SELECT content FROM cms_data WHERE id = 'latest'`;
      if (rows && rows.length > 0) {
        return rows[0].content;
      }
    } catch (err) {
      console.error('Postgres Read Error:', err);
    }
  }

  // 2. Fallback to Local Filesystem
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Local File Read Error:', err);
    return {}; // Final fallback
  }
}

export async function updateCMSData(newData: any) {
  if (!newData || Object.keys(newData).length === 0) {
    throw new Error("Cannot save empty data");
  }

  // 1. Try Vercel Postgres (Production)
  if (process.env.POSTGRES_URL) {
    try {
      await sql`CREATE TABLE IF NOT EXISTS cms_data (id VARCHAR(50) PRIMARY KEY, content JSONB, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`;
      
      // Upsert data
      await sql`
        INSERT INTO cms_data (id, content, updated_at) 
        VALUES ('latest', ${JSON.stringify(newData)}, CURRENT_TIMESTAMP)
        ON CONFLICT (id) 
        DO UPDATE SET content = ${JSON.stringify(newData)}, updated_at = CURRENT_TIMESTAMP
      `;
      return;
    } catch (err) {
      console.error('Postgres Write Error:', err);
      throw new Error(`Database Write Failed: ${err instanceof Error ? err.message : 'Unknown connection error'}. Make sure Postgres is linked in Vercel.`);
    }
  }

  // 2. Local Filesystem for Dev
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(newData, null, 2));
  } catch (err: any) {
    console.error('Filesystem Write Error:', err);
    if (process.env.NODE_ENV === 'production') {
       throw new Error(`PRODUCTION_STORAGE_MISSING: Vercel Postgres is not detected. Please connect it in the Vercel dashboard under 'Storage'.`);
    }
    throw new Error("Local filesystem error: Ensure src/data/db.json is writable.");
  }
}
