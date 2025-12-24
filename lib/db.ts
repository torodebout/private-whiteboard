import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
    if (!dbInstance) {
        const url = process.env.DB_FILE_URL;
        if (!url) {
            throw new Error('DB_FILE_URL is not defined');
        }

        const client = createClient({
            url,
        });

        client.execute(`
            CREATE TABLE IF NOT EXISTS scenes (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              key TEXT NOT NULL UNIQUE,
              data TEXT NOT NULL,
              updated_at INTEGER
            )
        `);

        dbInstance = drizzle(client, { schema });
    }
    return dbInstance;
}
