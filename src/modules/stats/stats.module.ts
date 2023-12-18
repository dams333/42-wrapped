import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { AchievmentsService } from './data/achievments.service';
import { IntraModule } from '../intra/intra.module';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationsService } from './data/locations.service';

@Module({
	imports: [IntraModule, PrismaModule],
	controllers: [StatsController],
	providers: [StatsService, AchievmentsService, LocationsService],
	exports: [StatsService],
})
export class StatsModule {}
