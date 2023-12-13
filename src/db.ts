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
	await db.run(`
		CREATE TABLE projects_raw (
			id INTEGER PRIMARY KEY,
			name TEXT,
			slug TEXT,
			final_mark INTEGER,
			team_count INTEGER,
			status TEXT,
			marked_at TEXT
		)
	`);
	await db.run(`
		CREATE TABLE projects_teams_raw (
			id INTEGER PRIMARY KEY,
			project_id INTEGER,
			name TEXT,
			final_mark INTEGER,
			created_at TEXT,
			updated_at TEXT,
			locked_at TEXT,
			closed_at TEXT,
			is_locked INTEGER,
			is_validated INTEGER,
			is_closed INTEGER,
			status TEXT,
			logins TEXT
		)
	`);
	await db.run(`
		CREATE TABLE projects_mate (
			id INTEGER PRIMARY KEY,
			login TEXT,
			collaborations TEXT
		)
	`);
	await db.run(`
		CREATE TABLE evaluation_corrector_raw (
				id INTEGER PRIMARY KEY,
				project TEXT,
				evaluated_at TEXT,
				evaluated_team INTEGER,
				evaluated_logins TEXT,
				final_mark INTEGER,
				is_validated INTEGER,
				comment TEXT,
				feedback TEXT,
				feedback_rated INTEGER,
				flag TEXT
			)
	`);
	await db.run(`
		CREATE TABLE evaluation_corrector_connexion (
			login TEXT PRIMARY KEY,
			count INTEGER
		)
	`);
	await db.run(`
		CREATE TABLE evaluation_corrected_raw (
			id INTEGER PRIMARY KEY,
			evaluated_at TEXT,
			project_id INTEGER,
			team_id INTEGER,
			evaluator TEXT,
			final_mark INTEGER,
			comment TEXT,
			feedback TEXT,
			feedback_rated INTEGER,
			flag TEXT,
			is_validated INTEGER
		)
	`);
	await db.run(`
		CREATE TABLE evaluation_corrected_connexion (
			login TEXT PRIMARY KEY,
			count INTEGER
		)
	`);
}
