import { IsString, MinLength } from 'class-validator';

export class RefreshTokenDTO {
	@IsString()
	@MinLength(1)
	refresh_token: string;
}
