import { IsString, MinLength } from 'class-validator';

export class RedirectUrlDTO {
	@IsString()
	@MinLength(1)
	callback_url: string;
}
