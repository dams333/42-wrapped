import 'dotenv/config';
import { Client } from '42.js';
import { fetchLocations } from './fetchers/locationFetcher';
import { open } from 'sqlite';
import { setupDb } from './db';
import { fetchAchievments } from './fetchers/achievmentsFetcher';
import { fetchProjects } from './fetchers/projectsFetcher';
import { fetchEvaluations } from './fetchers/evaluationsFetcher';

(async function () {
	const client = new Client(
		<string>process.env.API_42_ID,
		<string>process.env.API_42_SECRET,
	);

	const login = 'dhubleur';

	const user = await client.users.get(login);
	if (!user) {
		console.log('user not found');
		return;
	}
	const userId = user.id;

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
		await fetchLocations(client, userId, year, db);
		await fetchAchievments(client, userId, year, db);
		await fetchProjects(client, userId, year, db);
		await fetchEvaluations(client, userId, year, db);
	} catch (e) {
		console.log(e);
	}
})();
