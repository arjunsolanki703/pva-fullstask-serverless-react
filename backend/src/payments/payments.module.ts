import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminModule } from '../admin/admin.module';
import { UsersModule } from '../users/users.module';
import { PaymentsController } from './payments.controller';
import {
	PaymentTransactionHistory,
	PaymentTransactionHistorySchema,
} from './payments.model';
import { PaymentsService } from './payments.service';
@Module({
	imports: [
		forwardRef(() => UsersModule),
		forwardRef(() => AdminModule),
		MongooseModule.forFeature([
			{
				name: PaymentTransactionHistory.name,
				schema: PaymentTransactionHistorySchema,
			},
		]),
	],
	controllers: [PaymentsController],
	providers: [PaymentsService],
	exports: [PaymentsService],
})
export class PaymentsModule {}
