import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { IntraModule } from './modules/intra/intra.module';
import { AuthModule } from './modules/auth/auth.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
	imports: [PrismaModule, IntraModule, AuthModule, StatsModule],
	controllers: [],
	providers: [],
	exports: [],
})
export class AppModule {}
