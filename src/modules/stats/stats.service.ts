import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

@Injectable()
export class StatsService {
	async generateStats(user: User) {
		console.log('Generating stats for ' + user.login);
		return {
			result: 'ok',
		};
	}
}
