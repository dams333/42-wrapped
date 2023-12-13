import { Database } from 'sqlite';

export async function setupDb(db: Database) {
	await db.run(`
		CREATE TABLE locations_raw (
			id INTEGER PRIMARY KEY,
			begin_at TEXT,
			end_at TEXT,
			host TEXT
		)
	`);
	await db.run(`
		CREATE TABLE locations_host (
			host TEXT PRIMARY KEY,
			time INTEGER
		)
	`);
	await db.run(`
		CREATE TABLE locations_time (
			name TEXT PRIMARY KEY,
			time INTEGER
		)
	`);
	//Create an achievments_raw table with id, name, description, tier, kind, image, unlocked_at
	await db.run(`
		CREATE TABLE achievments_raw (
			id INTEGER PRIMARY KEY,
			name TEXT,
			description TEXT,
			tier TEXT,
			kind TEXT,
			image TEXT,
			unlocked_at TEXT
		)
	`);
}
