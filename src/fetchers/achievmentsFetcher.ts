import { Client } from '42.js';
import { Database } from 'sqlite';

export async function fetchAchievments(
	client: Client,
	userId: number,
	year: number,
	db: Database,
) {
	const achievments_users: any[] = await client.fetch(
		'achievements_users?filter[user_id]=' +
			userId +
			`&range[updated_at]=${year}-01-01T00:00:00.000Z,${year}-12-31T23:59:59.999Z` +
			'&range[nbr_of_success]=1,1000',
	);
	const achievments: any[] = await client.fetch(
		'achievements?filter[id]=' +
			achievments_users.map((a) => a.achievement_id).join(','),
	);
	for (const achievment_user of achievments_users) {
		const { id, updated_at } = achievment_user;
		const achievment = achievments.find(
			(a) => a.id === achievment_user.achievement_id,
		);
		if (!achievment) {
			continue;
		}
		const { name, description, tier, kind, image } = achievment;
		const unlocked_at = updated_at;
		await db.run(
			'INSERT INTO achievments_raw VALUES (?, ?, ?, ?, ?, ?, ?)',
			id,
			name,
			description,
			tier,
			kind,
			image,
			unlocked_at,
		);
	}
}
