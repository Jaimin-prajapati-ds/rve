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

  // 2. Fallback to Local Filesystem (With State Tracking)
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    
    // Add system flag if we are in production but postgres is missing
    if (process.env.NODE_ENV === 'production' && !process.env.POSTGRES_URL) {
      return { ...parsed, _system: { storageMissing: true } };
    }
    
    return parsed;
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
      
      await sql`
        INSERT INTO cms_data (id, content, updated_at) 
        VALUES ('latest', ${JSON.stringify(newData)}, CURRENT_TIMESTAMP)
        ON CONFLICT (id) 
        DO UPDATE SET content = ${JSON.stringify(newData)}, updated_at = CURRENT_TIMESTAMP
      `;
      return;
    } catch (err) {
      console.error('Postgres Write Error:', err);
      // We don't throw here to allow fallback attempts, but we log the failure
    }
  }

  // 2. Local Filesystem (Primary for Dev, Fallback for Prod)
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(newData, null, 2));
    
    if (process.env.NODE_ENV === 'production' && !process.env.POSTGRES_URL) {
       console.warn('PRODUCTION_SAVE_TEMP: Saved to local filesystem. Note: This is ephemeral on Vercel.');
    }
  } catch (err: any) {
    console.error('Filesystem Write Error:', err);
    throw new Error("Persistence failure: Storage is unavailable or read-only.");
  }
}
