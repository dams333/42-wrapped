import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { useContainer } from 'class-validator';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
		}),
	);
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	app.enableCors();
	app.useWebSocketAdapter(new WsAdapter(app));
	await app.listen(3000);
}
bootstrap();
