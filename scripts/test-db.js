/* eslint-disable @typescript-eslint/no-require-imports */
const Database = require('better-sqlite3');
try {
    const db = new Database('sqlite.db');
    console.log('database opened');
    db.exec('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY)');
    console.log('table created');
} catch (e) {
    console.error('failed to open database:', e);
}
