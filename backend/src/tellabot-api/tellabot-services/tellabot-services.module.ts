import {
	RecentWebsite,
	RecentWebsiteSchema,
} from '../tellabot-recentwebsite.model';
import {
	TellabotService,
	TellabotServiceSchema,
} from './tellabot-services.model';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TellabotServicesController } from './tellabot-services.controller';
import { TellabotServicesService } from './tellabot-services.service';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: TellabotService.name, schema: TellabotServiceSchema },
		]),
		MongooseModule.forFeature([
			{ name: RecentWebsite.name, schema: RecentWebsiteSchema },
		]),
	],
	controllers: [TellabotServicesController],
	providers: [TellabotServicesService],
	exports: [TellabotServicesService],
})
export class TellabotServicesModule {}
