import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IntraService } from 'src/modules/intra/intra.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class LocationsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly intraService: IntraService,
	) {}

	get apiClient() {
		return this.intraService.apiClient;
	}

	async generateLocations(user: User, year: number, datasId: number) {
		console.log('Generating locations for ' + user.login + '...');

		const locations: any[] = await this.apiClient.fetch(
			'users/' +
				user.id +
				`/locations?range[begin_at]=${year}-01-01T00:00:00.000Z,${year}-12-31T23:59:59.999Z&filter[inactive]=true`,
		);
		await this.prismaService.location.createMany({
			data: locations.map((location) => {
				return {
					userDatasId: datasId,
					beginAt: location.begin_at,
					endAt: location.end_at,
					host: location.host,
				};
			}),
			skipDuplicates: true,
		});

		console.log('Generated locations for ' + user.login + '!');
		return {
			result: 'ok',
		};
	}
}
