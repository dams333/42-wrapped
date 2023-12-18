import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { IntraService } from '../intra/intra.service';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { StatsModule } from '../stats/stats.module';

@Module({
	imports: [
		JwtModule.register({
			secret: `${process.env.JWT_SECRET}`,
			signOptions: { expiresIn: '180s' },
		}),
		StatsModule,
	],
	controllers: [AuthController],
	providers: [AuthService, UserService, IntraService, PrismaService],
})
export class AuthModule {}
