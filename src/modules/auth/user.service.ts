import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '42.js';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class UserService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly statsService: StatsService,
	) {}

	async createUser(user42: User) {
		const user = await this.prismaService.user.create({
			data: {
				id: user42.id,
				login: user42.login,
			},
		});
		this.statsService.generateStats(user);
		return user;
	}
}
