import { Client } from '42.js';
import { Database } from 'sqlite';

export async function fetchLocations(
	client: Client,
	login: string,
	year: number,
	db: Database,
) {
	const locations: any[] = await client.fetch(
		'users/' +
			login +
			`/locations?range[begin_at]=${year}-01-01T00:00:00.000Z,${year}-12-31T23:59:59.999Z&filter[inactive]=true`,
	);
	for (const location of locations) {
		const { id, host, end_at, begin_at } = location;
		await db.run(
			'INSERT INTO locations_raw (id, begin_at, end_at, host) VALUES (?, ?, ?, ?)',
			[id, begin_at, end_at, host],
		);
	}
	await db.run(`
		INSERT INTO locations_host (host, time)
		SELECT host, SUM(strftime('%s', end_at) - strftime('%s', begin_at)) AS time
		FROM locations_raw
		GROUP BY host
	`);
	await db.run(`
		INSERT INTO locations_time (name, time)
		SELECT strftime('%Y-%m', begin_at) AS name, SUM(strftime('%s', end_at) - strftime('%s', begin_at)) AS time
		FROM locations_raw
		GROUP BY name
	`);
}
