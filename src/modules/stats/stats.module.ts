import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { AchievmentsService } from './data/achievments.service';
import { IntraModule } from '../intra/intra.module';
import { PrismaModule } from '../prisma/prisma.module';
import { LocationsService } from './data/locations.service';
import { EventsService } from './data/events.service';
import { ProjectsService } from './data/projects.service';

@Module({
	imports: [IntraModule, PrismaModule],
	controllers: [StatsController],
	providers: [
		StatsService,
		AchievmentsService,
		LocationsService,
		EventsService,
		ProjectsService,
	],
	exports: [StatsService],
})
export class StatsModule {}
