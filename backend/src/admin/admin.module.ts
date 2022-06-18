import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { TellabotServicesModule } from '../tellabot-api/tellabot-services/tellabot-services.module';
import { TellabotApiModule } from '../tellabot-api/tellabot-api.module';
import { PaymentsModule } from '../payments/payments.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSetting, AdminSettingSchema } from './admin.model';
import { PaypalEmail, PaypalEmailSchema } from './paypal-email.model';
import { Announcement, AnnouncementSchema } from './announcement.model';
@Module({
	imports: [
		forwardRef(() => UsersModule),
		TellabotServicesModule,
		forwardRef(() => TellabotApiModule),
		PaymentsModule,
		MongooseModule.forFeature([
			{ name: AdminSetting.name, schema: AdminSettingSchema },
		]),
		MongooseModule.forFeature([
			{ name: PaypalEmail.name, schema: PaypalEmailSchema },
		]),
		MongooseModule.forFeature([
			{ name: Announcement.name, schema: AnnouncementSchema },
		]),
	],
	controllers: [AdminController],
	providers: [AdminService],
	exports: [AdminService],
})
export class AdminModule {}
