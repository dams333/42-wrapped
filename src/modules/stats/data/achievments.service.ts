import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IntraService } from 'src/modules/intra/intra.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class AchievmentsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly intraService: IntraService,
	) {}

	get apiClient() {
		return this.intraService.apiClient;
	}

	async generateAchievments(user: User, year: number, datasId: number) {
		console.log('Generating achievments for ' + user.login + '...');

		const achievments_users: any[] = await this.apiClient.fetch(
			'achievements_users?filter[user_id]=' +
				user.id +
				`&range[updated_at]=${year}-01-01T00:00:00.000Z,${year}-12-31T23:59:59.999Z` +
				'&range[nbr_of_success]=1,1000',
		);
		let achievements_ids = achievments_users.map(
			(achievment_user) => achievment_user.achievement_id,
		);
		const inDbAchievments = await this.prismaService.achievment.findMany({
			where: {
				id: {
					in: achievements_ids,
				},
			},
		});
		achievements_ids = achievements_ids.filter((achievement_id) => {
			return !inDbAchievments.find(
				(achievment) => achievment.id === achievement_id,
			);
		});
		const achievments: any[] = await this.apiClient.fetch(
			'achievements?filter[id]=' + achievements_ids.join(','),
		);
		await this.prismaService.achievment.createMany({
			data: achievments.map((achievment) => {
				return {
					id: achievment.id,
					name: achievment.name,
					description: achievment.description,
					tier: achievment.tier,
					kind: achievment.kind,
					image: achievment.image,
				};
			}),
		});
		await this.prismaService.achivementUser.createMany({
			data: achievments_users.map((achievment_user) => {
				return {
					achievmentId: achievment_user.achievement_id,
					userDatasId: datasId,
					unlockedAt: achievment_user.updated_at,
				};
			}),
		});
		console.log('Generated achievments for ' + user.login + '!');
		return {
			result: 'ok',
		};
	}
}
