import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { IntraService } from 'src/modules/intra/intra.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ProjectsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly intraService: IntraService,
	) {}

	get apiClient() {
		return this.intraService.apiClient;
	}

	async generateProjects(user: User, year: number, datasId: number) {
		console.log('Generating projects for ' + user.login + '...');

		let projectsUsers: any[] = await this.apiClient.fetch(
			`/users/${user.id}/projects_users?` +
				`range[marked_at]=${year}-01-01,${year}-12-31` +
				`&filter[marked]=true`,
		);

		for (let i = 0; i < projectsUsers.length; i++) {
			projectsUsers[i].teams = projectsUsers[i].teams.filter(
				(t: any) =>
					new Date(t.updated_at) > new Date(`${year}-01-01`) &&
					new Date(t.updated_at) < new Date(`${year}-12-31`),
			);
		}

		projectsUsers = projectsUsers.filter(
			(pu: any) => pu.teams.length > 0 && pu.project.parent_id === null,
		);

		await this.prismaService.project.createMany({
			data: projectsUsers.map((projectUser) => {
				return {
					id: projectUser.project.id,
					name: projectUser.project.name,
					slug: projectUser.project.slug,
					cursus: projectUser.cursus_ids[0],
				};
			}),
		});

		await this.prismaService.projectUser.createMany({
			data: projectsUsers.map((projectUser) => {
				return {
					id: projectUser.id,
					userDatasId: datasId,
					projectId: projectUser.project.id,
					finalMark: projectUser.final_mark,
					status: projectUser.status,
					markedAt: projectUser.marked_at,
					isValidated: projectUser['validated?'] || false,
				};
			}),
		});

		await this.prismaService.projectUserTeam.createMany({
			data: projectsUsers.flatMap((projectUser) => {
				return projectUser.teams.map((team: any) => {
					return {
						id: team.id,
						projectUserId: projectUser.id,
						name: team.name,
						finalMark: team.final_mark,
						status: team.status,
						createdAt: team.created_at,
						lockedAt: team.locked_at,
						closedAt: team.closed_at,
						isValidated: team['validated?'] || false,
						isLocked: team['locked?'] || false,
						isClosed: team['closed?'] || false,
						users: team.users.map((user: any) => user.login),
					};
				});
			}),
		});

		console.log('Generated projects for ' + user.login + '!');
		return {
			result: 'ok',
		};
	}
}
