import { JWT_SECRET } from '../environments';
import {
	Injectable,
	CanActivate,
	ExecutionContext,
	HttpException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AdminService } from '../admin/admin.service';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private adminService: AdminService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const maintenance = await this.adminService.getmaintenancemode();
		const ctx = context.switchToHttp().getRequest();
		if (!ctx.headers['authorization']) {
			throw new HttpException('UNAUTHORIZED USER', 401);
		}
		ctx.user = await this.validateToken(ctx.headers['authorization'], ctx);
		if (maintenance.data.maintenance && ctx.user.type === 'client') {
			return false;
		}
		return true;
	}

	async validateToken(accessToken: string, res) {
		if (accessToken.split(' ')[0] !== 'Bearer') {
			throw new HttpException('UNAUTHORIZED USER', 401);
		}
		const token = accessToken.split(' ')[1];
		try {
			return jwt.verify(token, JWT_SECRET);
		} catch (err) {
			throw new HttpException('UNAUTHORIZED USER', 401);
		}
	}
}

export class AdminGuard implements CanActivate {
	constructor(private userService: UsersService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = context.switchToHttp().getRequest();
		if (!ctx.headers['authorization']) {
			throw new HttpException('UNAUTHORIZED USER', 401);
		}
		ctx.user = await this.validateToken(ctx.headers['authorization'], ctx);
		if (ctx.user.type === 'admin') {
			return true;
		}
		return false;
	}

	async validateToken(accessToken: string, res) {
		if (accessToken.split(' ')[0] !== 'Bearer') {
			throw new HttpException('UNAUTHORIZED USER', 401);
		}
		const token = accessToken.split(' ')[1];
		try {
			return jwt.verify(token, JWT_SECRET);
		} catch (err) {
			throw new HttpException('UNAUTHORIZED USER', 401);
		}
	}
}
