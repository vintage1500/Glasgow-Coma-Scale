import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("gcs.db");

export async function initDb() {
  db.execSync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    INSERT OR IGNORE INTO sessions (id, user_id) VALUES (1, NULL);

    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      eye INTEGER NOT NULL,
      verbal INTEGER NOT NULL,
      motor INTEGER NOT NULL,
      total INTEGER NOT NULL,
      interpretation TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

export function run(sql, params = []) {
  return db.runSync(sql, params);
}

export function getFirst(sql, params = []) {
  return db.getFirstSync(sql, params);
}

export function getAll(sql, params = []) {
  return db.getAllSync(sql, params);
}
