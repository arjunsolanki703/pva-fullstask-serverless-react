import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from '../admin/admin.module';
import { UsersModule } from '../users/users.module';

import { NewsController } from './news.controller';
import { NewsSchema, News } from './news.model';
import { NewsService } from './news.service';

@Module({
	imports: [
		UsersModule,
		AdminModule,
		MongooseModule.forFeature([
			{
				name: News.name,
				schema: NewsSchema,
			},
		]),
	],
	controllers: [NewsController],
	providers: [NewsService],
	exports: [NewsService],
})
export class NewsModule {}
