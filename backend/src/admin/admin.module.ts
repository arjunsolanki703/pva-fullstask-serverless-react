import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from '../users/users.module';
import { boatServicesModule } from '../boat-api/boat-services/boat-services.module';
import { boatApiModule } from '../boat-api/boat-api.module';
import { PaymentsModule } from '../payments/payments.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSetting, AdminSettingSchema } from './admin.model';
import { PaypalEmail, PaypalEmailSchema } from './paypal-email.model';
import { Announcement, AnnouncementSchema } from './announcement.model';
@Module({
	imports: [
		forwardRef(() => UsersModule),
		boatServicesModule,
		forwardRef(() => boatApiModule),
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
