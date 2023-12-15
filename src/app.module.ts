import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { IntraModule } from './modules/intra/intra.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
	imports: [PrismaModule, IntraModule, AuthModule],
	controllers: [],
	providers: [],
	exports: [],
})
export class AppModule {}
