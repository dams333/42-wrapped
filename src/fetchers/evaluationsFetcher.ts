import { Client } from '42.js';
import { Database } from 'sqlite';

async function fetchAsCorrector(
	client: Client,
	userId: number,
	year: number,
	db: Database,
) {
	const scaleTeams: any[] = await client.fetch(
		`/users/${userId}/scale_teams/as_corrector?` +
			`range[filled_at]=${year}-01-01,${year}-12-31`,
	);
	const sessions: any[] = await client.fetch(
		`project_sessions?filter[id]=` +
			scaleTeams
				.map((scaleTeam: any) => scaleTeam.team.project_session_id)
				.join(','),
	);
	let corrector_connexions: Record<string, number> = {};
	for (const scaleTeam of scaleTeams) {
		const { id, filled_at, final_mark, comment, feedback } = scaleTeam;
		const evaluated_at = filled_at;
		const { name } = scaleTeam.team;
		const evaluated_team = name;
		const evaluated_logins = scaleTeam.team.users
			.map((user: any) => user.login)
			.join(',');
		const flag = scaleTeam.flag.name;
		const feedback_rated = scaleTeam.feedbacks.length
			? scaleTeam.feedbacks[0].rating
			: null;
		const is_validated = scaleTeam.team['validated?'];
		const project = sessions.find(
			(session) => session.id === scaleTeam.team.project_session_id,
		).project.name;
		for (const login of evaluated_logins.split(',')) {
			if (corrector_connexions[login] === undefined) {
				corrector_connexions[login] = 0;
			}
			corrector_connexions[login]++;
		}
		await db.run(
			`INSERT INTO evaluation_corrector_raw VALUES
			(?,?,?,?,?,?,?,?,?,?,?)`,
			[
				id,
				project,
				evaluated_at,
				evaluated_team,
				evaluated_logins,
				final_mark,
				is_validated,
				comment,
				feedback,
				feedback_rated,
				flag,
			],
		);
	}
	for (const login in corrector_connexions) {
		await db.run(
			`INSERT INTO evaluation_corrector_connexion VALUES (?,?)`,
			[login, corrector_connexions[login]],
		);
	}
}

async function fetchAsCorrected(
	client: Client,
	userId: number,
	year: number,
	db: Database,
) {
	const scaleTeams: any[] = await client.fetch(
		`/users/${userId}/scale_teams/as_corrected?` +
			`range[filled_at]=${year}-01-01,${year}-12-31`,
	);
	let corrector_connexions: Record<string, number> = {};
	for (const scaleTeam of scaleTeams) {
		const { id, filled_at, final_mark, comment, feedback } = scaleTeam;
		const evaluated_at = filled_at;
		const flag = scaleTeam.flag.name;
		const feedback_rated = scaleTeam.feedbacks.length
			? scaleTeam.feedbacks[0].rating
			: null;
		const is_validated = scaleTeam.team['validated?'];
		const project_id = scaleTeam.team.project_id;
		const team_id = scaleTeam.team.id;
		const evaluator = scaleTeam.corrector.login;
		if (corrector_connexions[evaluator] === undefined) {
			corrector_connexions[evaluator] = 0;
		}
		corrector_connexions[evaluator]++;
		await db.run(
			`INSERT INTO evaluation_corrected_raw VALUES
			(?,?,?,?,?,?,?,?,?,?,?)`,
			[
				id,
				evaluated_at,
				project_id,
				team_id,
				evaluator,
				final_mark,
				comment,
				feedback,
				feedback_rated,
				flag,
				is_validated,
			],
		);
	}
	for (const login in corrector_connexions) {
		await db.run(
			`INSERT INTO evaluation_corrected_connexion VALUES (?,?)`,
			[login, corrector_connexions[login]],
		);
	}
}

export async function fetchEvaluations(
	client: Client,
	userId: number,
	year: number,
	db: Database,
) {
	await fetchAsCorrector(client, userId, year, db);
	await fetchAsCorrected(client, userId, year, db);
}
