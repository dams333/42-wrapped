import { Client } from '42.js';
import { Database } from 'sqlite';

export async function fetchEvents(
	client: Client,
	userId: number,
	year: number,
	db: Database,
) {
	let events: any[] = await client.fetch(
		`/users/${userId}/events_users` +
			`?range[updated_at]=${year}-01-01,${year}-12-31`,
	);
	events = events.filter(
		(event) => new Date(event.event.begin_at).getFullYear() === year,
	);
	for (const event of events) {
		const e = event.event;
		const { id, name, begin_at, location, kind } = e;
		await db.run(
			'INSERT INTO events_raw(id, name, begin_at, location, kind) VALUES(?, ?, ?, ?, ?)',
			[id, name, begin_at, location, kind],
		);
	}
	await db.run(`
		INSERT INTO events_kind
		SELECT kind, COUNT(*) AS count
		FROM events_raw
		WHERE kind IS NOT NULL AND kind != ''
		GROUP BY kind
	`);
	await db.run(`
		INSERT INTO events_locations
		SELECT location, COUNT(*) AS count
		FROM events_raw
		WHERE location IS NOT NULL AND location != ''
		GROUP BY location
	`);
}
