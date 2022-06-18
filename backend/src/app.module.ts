import { CAPTCHA_SECRET_KEY, MONGO_URI } from './environments';

import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NewsModule } from './news/news.module';
import { PaymentsModule } from './payments/payments.module';
import { boatApiModule } from './boat-api/boat-api.module';
import { TicketModule } from './tickets/tickets.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		GoogleRecaptchaModule.forRoot({
			secretKey: CAPTCHA_SECRET_KEY,
			response: (req) => req.headers.recaptcha,
		}),
		MongooseModule.forRoot(MONGO_URI, {
			useNewUrlParser: true,
			useFindAndModify: false,
		}),
		UsersModule,
		AuthModule,
		boatApiModule,
		PaymentsModule,
		TicketModule,
		AdminModule,
		NewsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
