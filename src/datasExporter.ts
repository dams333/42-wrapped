import { Database } from 'sqlite';

export async function exportDatas(db: Database) {
	let datas: any = {};

	datas.locations = {};
	const total: any[] = await db.all(`
		SELECT SUM(strftime('%s', end_at) - strftime('%s', begin_at)) AS time
		FROM locations_raw
	`);
	datas.locations.total_time = total[0].time;
	const byHost: any[] = await db.all(`
		SELECT host, time FROM locations_host
		ORDER BY time DESC
		LIMIT 3
	`);
	datas.locations.byHost = byHost;
	const byTime: any[] = await db.all(`
		SELECT name, time FROM locations_time
	`);
	const months: any[] = [];
	for (let i = 1; i <= 12; i++) {
		months.push({ month: i, time: 0 });
	}
	for (const month of byTime) {
		const date = new Date(month.name);
		months[date.getMonth()].time = month.time;
	}
	datas.locations.byMonth = months;

	return datas;
}
