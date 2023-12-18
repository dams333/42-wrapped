import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IntraService } from 'src/modules/intra/intra.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class EventsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly intraService: IntraService,
	) {}

	get apiClient() {
		return this.intraService.apiClient;
	}

	async generateEvents(user: User, year: number, datasId: number) {
		console.log('Generating events for ' + user.login + '...');

		let eventsUsers: any[] = await this.apiClient.fetch(
			`/users/${user.id}/events_users` +
				`?range[updated_at]=${year}-01-01,${year}-12-31`,
		);
		eventsUsers = eventsUsers.filter(
			(event) => new Date(event.event.begin_at).getFullYear() === year,
		);
		await this.prismaService.event.createMany({
			data: eventsUsers.map((event) => ({
				id: event.id,
				name: event.event.name,
				beginAt: event.event.begin_at,
				location: event.event.location,
				kind: event.event.kind,
			})),
			skipDuplicates: true,
		});
		await this.prismaService.eventUser.createMany({
			data: eventsUsers.map((event) => ({
				userDatasId: datasId,
				eventId: event.id,
			})),
			skipDuplicates: true,
		});

		console.log('Generated events for ' + user.login + '!');
		return {
			result: 'ok',
		};
	}
}
