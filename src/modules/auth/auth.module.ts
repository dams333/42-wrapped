import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { StatsModule } from '../stats/stats.module';
import { IntraModule } from '../intra/intra.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
	imports: [
		JwtModule.register({
			secret: `${process.env.JWT_SECRET}`,
			signOptions: { expiresIn: '180s' },
		}),
		StatsModule,
		IntraModule,
		PrismaModule,
	],
	controllers: [AuthController],
	providers: [AuthService, UserService],
})
export class AuthModule {}
