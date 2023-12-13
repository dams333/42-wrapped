import 'dotenv/config';
import { Client } from '42.js';
import { fetchLocations } from './fetchers/locationFetcher';

(async function () {
	const client = new Client(
		<string>process.env.API_42_ID,
		<string>process.env.API_42_SECRET,
	);

	const login = 'dhubleur';

	console.log(await client.users.get(login));

	fetchLocations(client, login);
})();
