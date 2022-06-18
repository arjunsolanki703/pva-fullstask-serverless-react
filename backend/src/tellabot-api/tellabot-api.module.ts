import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TellabotApiController } from './tellabot-api.controller';
import { TellabotApiService } from './tellabot-api.service';
import {
	TellabotTransaction,
	TellabotTransactionSchema,
} from './tellatbot-transaction.model';
import {
	RecentWebsiteSchema,
	RecentWebsite,
} from './tellabot-recentwebsite.model';
import { TellabotServicesModule } from './tellabot-services/tellabot-services.module';
import { UsersModule } from '../users/users.module';
import { AdminModule } from '../admin/admin.module';
@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: TellabotTransaction.name, schema: TellabotTransactionSchema },
		]),
		MongooseModule.forFeature([
			{ name: RecentWebsite.name, schema: RecentWebsiteSchema },
		]),
		TellabotServicesModule,
		forwardRef(() => UsersModule),
		forwardRef(() => AdminModule),
	],
	controllers: [TellabotApiController],
	providers: [TellabotApiService, TellabotTransaction],
	exports: [TellabotApiService],
})
export class TellabotApiModule {}
