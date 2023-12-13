import { Client } from '42.js';
import { Database } from 'sqlite';

export async function fetchProjects(
	client: Client,
	userId: number,
	year: number,
	db: Database,
) {
	let projects: any[] = await client.fetch(
		`/users/${userId}/projects_users?` +
			`range[marked_at]=${year}-01-01,${year}-12-31` +
			`&filter[marked]=true`,
	);
	let mates: Record<string, number> = {};
	projects = projects.filter((p: any) => p.project.parent_id === null);
	for (const project of projects) {
		const { final_mark, status, marked_at } = project;
		const { id, name, slug } = project.project;
		const teams = project.teams.filter(
			(t: any) =>
				new Date(t.updated_at) > new Date(`${year}-01-01`) &&
				new Date(t.updated_at) < new Date(`${year}-12-31`) &&
				t.status === 'finished',
		);
		const team_count = teams.length;
		await db.run(
			`INSERT INTO projects_raw (id, name, slug, final_mark, team_count, status, marked_at) ` +
				`VALUES (?, ?, ?, ?, ?, ?, ?)`,
			[id, name, slug, final_mark, team_count, status, marked_at],
		);
		for (const team of teams) {
			const {
				id,
				name,
				final_mark,
				created_at,
				updated_at,
				locked_at,
				closed_at,
				status,
			} = team;
			const is_closed = team['closed?'];
			const is_locked = team['locked?'];
			const is_validated = team['validated?'];
			const logins = team.users.map((u: any) => u.login).join(',');
			await db.run(
				`INSERT INTO projects_teams_raw (id, project_id, name, final_mark, created_at, updated_at, locked_at, closed_at, is_locked, is_validated, is_closed, status, logins) ` +
					`VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					id,
					project.project.id,
					name,
					final_mark,
					created_at,
					updated_at,
					locked_at,
					closed_at,
					is_locked,
					is_validated,
					is_closed,
					status,
					logins,
				],
			);
			for (const user of team.users) {
				if (user.id === userId) {
					continue;
				}
				if (mates[user.login] === undefined) {
					mates[user.login] = 0;
				}
				mates[user.login]++;
			}
		}
	}
	for (const login in mates) {
		await db.run(
			`INSERT INTO projects_mate (login, collaborations) ` +
				`VALUES (?, ?)`,
			[login, mates[login]],
		);
	}
}
