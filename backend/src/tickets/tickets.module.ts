import { Module, forwardRef } from '@nestjs/common';
import { Ticket, ToicketSchema } from './tickets.modal';

import { AdminModule } from '../admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TicketApiService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [
		UsersModule,
		AdminModule,
		MongooseModule.forFeature([
			{
				name: Ticket.name,
				schema: ToicketSchema,
			},
		]),
	],
	controllers: [TicketsController],
	providers: [TicketApiService],
	exports: [TicketApiService],
})
export class TicketModule {}
