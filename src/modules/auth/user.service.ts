import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '42.js';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	async createUser(user42: User) {
		return await this.prismaService.user.create({
			data: {
				login: user42.login,
			},
		});
	}
}
