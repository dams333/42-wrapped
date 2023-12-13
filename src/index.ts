import 'dotenv/config';
import { Client } from '42.js';
import { fetchLocations } from './fetchers/locationFetcher';
import { open } from 'sqlite';
import { setupDb } from './db';

(async function () {
	const client = new Client(
		<string>process.env.API_42_ID,
		<string>process.env.API_42_SECRET,
	);

	const login = 'dhubleur';
	const year = 2023;

	try {
		const db = await open('db.sqlite');
		const rows = await db.all(
			"SELECT name FROM sqlite_master WHERE type='table'",
		);
		if (rows.length > 0) {
			console.log('db is not empty');
			return;
		}
		setupDb(db);
		await fetchLocations(client, login, year, db);
	} catch (e) {
		console.log(e);
	}
})();
