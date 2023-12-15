import { LoggedUser } from '42.js/dist/structures/logged_user';
import {
	BadRequestException,
	Inject,
	Injectable,
	InternalServerErrorException,
	forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => PrismaService))
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}

	async connectUser(user42: LoggedUser) {
		let user = await this.prismaService.user.findUnique({
			where: {
				login: user42.login,
			},
		});
		let state = 'connected';
		if (!user) {
			user = await this.userService.createUser(user42);
			if (!user)
				throw new InternalServerErrorException('Failed to create user');
			state = 'created';
		}
		const tokens = await this.generateTokens(user);
		return {
			state: state,
			tokens: tokens,
		};
	}

	async refresh(refreshToken: string) {
		try {
			const token = this.jwtService.verify(refreshToken);
			if (
				!token.type ||
				!token.user ||
				!token.identifier ||
				token.type !== 'refresh'
			) {
				throw new BadRequestException('Invalid refresh token');
			}
			const identifier =
				await this.prismaService.authIdentifier.findUnique({
					where: {
						identifier: token.identifier,
					},
				});
			if (!identifier) {
				await this.prismaService.authIdentifier.deleteMany({
					where: {
						userId: token.user.id,
					},
				});
				throw new BadRequestException('Invalid refresh token');
			}
			//TODO: Reactivate this
			// setTimeout(async () => {
			// 	if (
			// 		await this.prismaService.authIdentifier.findUnique({
			// 			where: {
			// 				identifier: token.identifier,
			// 			},
			// 		})
			// 	) {
			// 		await this.prismaService.authIdentifier.deleteMany({
			// 			where: {
			// 				identifier: token.identifier,
			// 			},
			// 		});
			// 	}
			// }, 1000 * 2);
			const user = await this.prismaService.user.findUnique({
				where: {
					id: token.user.id,
				},
			});
			if (!user) throw new BadRequestException('User not found');
			return await this.generateTokens(user);
		} catch (e) {
			throw new BadRequestException('Invalid refresh token');
		}
	}

	async generateTokens(user: User) {
		const access_token = this.generateAccessToken(user);
		const new_refresh_token = await this.generateRefreshToken(user);
		return {
			access_token: {
				token: access_token,
				expires_in: '180s',
			},
			refresh_token: {
				token: new_refresh_token,
				expires_in: '7d',
			},
		};
	}

	generateAccessToken(user: User) {
		return this.jwtService.sign({
			type: 'access',
			user: {
				id: user.id,
				login: user.login,
			},
		});
	}

	async generateRefreshToken(user: User) {
		const identifier = Math.random().toString(36).substring(2, 15);
		await this.prismaService.authIdentifier.create({
			data: {
				userId: user.id,
				identifier: identifier,
			},
		});
		return this.jwtService.sign(
			{
				type: 'refresh',
				identifier: identifier,
				user: {
					id: user.id,
				},
			},
			{ expiresIn: '7d' },
		);
	}

	async verifyAccessToken(token: string): Promise<User> {
		try {
			const decoded = this.jwtService.verify(token);
			if (!decoded.type || !decoded.user || decoded.type !== 'access') {
				throw new BadRequestException('Invalid access token');
			}
			return await this.prismaService.user.findUnique({
				where: {
					id: decoded.user.id,
				},
			});
		} catch (e) {
			throw new BadRequestException('Invalid access token');
		}
	}

	async logout(refreshToken: string) {
		try {
			const decode = this.jwtService.verify(refreshToken);
			if (
				!decode ||
				!decode.type ||
				decode.type !== 'refresh' ||
				!decode.identifier
			) {
				throw new BadRequestException('Invalid refresh token');
			}
			await Promise.all([
				this.prismaService.authIdentifier.deleteMany({
					where: {
						identifier: decode.identifier,
					},
				}),
			]);
		} catch (e) {
			throw new BadRequestException('Invalid refresh token');
		}
	}
}
