import { Module } from '@nestjs/common';
import { IntraService } from './intra.service';

@Module({
	imports: [],
	controllers: [],
	providers: [IntraService],
	exports: [IntraService],
})
export class IntraModule {}
