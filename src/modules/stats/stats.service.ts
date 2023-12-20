import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AchievmentsService } from './data/achievments.service';
import { PrismaService } from '../prisma/prisma.service';
import { LocationsService } from './data/locations.service';
import { EventsService } from './data/events.service';
import { ProjectsService } from './data/projects.service';

@Injectable()
export class StatsService {
	private year = 2023;

	constructor(
		private readonly achievmentsService: AchievmentsService,
		private readonly prismaService: PrismaService,
		private readonly locationsService: LocationsService,
		private readonly eventsService: EventsService,
		private readonly projectsService: ProjectsService,
	) {}

	async generateStats(user: User) {
		console.log('Generating stats for ' + user.login + '...');
		const userInDb = await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				areDatasFetched: false,
				datas: {
					create: {
						year: this.year,
					},
				},
			},
			include: {
				datas: true,
			},
		});
		await Promise.all([
			this.achievmentsService.generateAchievments(
				user,
				this.year,
				userInDb.datas.id,
			),
			this.locationsService.generateLocations(
				user,
				this.year,
				userInDb.datas.id,
			),
			this.eventsService.generateEvents(
				user,
				this.year,
				userInDb.datas.id,
			),
			this.projectsService.generateProjects(
				user,
				this.year,
				userInDb.datas.id,
			),
		]);
		console.log('Generated stats for ' + user.login + '!');
		await this.prismaService.user.update({
			where: {
				id: user.id,
			},
			data: {
				areDatasFetched: true,
			},
		});
		return {
			result: 'ok',
		};
	}
}
