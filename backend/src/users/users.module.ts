import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { TellabotApiModule } from '../tellabot-api/tellabot-api.module';
import { AdminModule } from '../admin/admin.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
	imports: [
		// AdminModule,
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		forwardRef(() => AdminModule),
		forwardRef(() => TellabotApiModule),
		PaymentsModule,
	],
	providers: [UsersService],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
