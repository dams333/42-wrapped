import {
	BadRequestException,
	Body,
	Controller,
	Post,
	Query,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { IntraService } from '../intra/intra.service';
import { AuthService } from './auth.service';
import { RefreshTokenDTO } from './DTO/RefreshToken.DTO';
import { AuthGuard } from './guards/auth.guard';
import { RedirectUrlDTO } from './DTO/RedirectUrl.DTO';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly intraService: IntraService,
		private readonly authService: AuthService,
	) {}

	@Post()
	async redirectToAuth(
		@Body(new ValidationPipe()) redirectUrl: RedirectUrlDTO,
	) {
		return {
			url: (
				await this.intraService.getAuthProcess(redirectUrl.callback_url)
			).url,
		};
	}

	@Post('callback')
	async callback(@Query('code') code: string) {
		if (!code) {
			throw new BadRequestException('No code provided');
		}
		const user =
			await this.intraService.client.auth_manager.response_auth_process(
				(
					await this.intraService.getAuthProcess(null)
				).id,
				code,
			);
		if (!user) {
			throw new BadRequestException('No user found on 42 intranet');
		}
		return await this.authService.connectUser(user);
	}

	@Post('refresh')
	async refresh(
		@Body(new ValidationPipe()) refresh_tokenDTO: RefreshTokenDTO,
	) {
		const refreshToken = refresh_tokenDTO.refresh_token;
		if (!refreshToken) {
			throw new BadRequestException('No refresh token provided');
		}
		return await this.authService.refresh(refreshToken);
	}

	@Post('logout')
	@UseGuards(AuthGuard)
	async logout(@Body('refresh_token') refreshToken: string) {
		return await this.authService.logout(refreshToken);
	}
}
