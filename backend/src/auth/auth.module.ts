import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AdminModule } from '../admin/admin.module';
@Module({
	imports: [UsersModule, AdminModule],
	controllers: [AuthController],
})
export class AuthModule {}
