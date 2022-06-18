import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Post,
	Query,
	Req,
	Res,
	UseGuards,
	Param,
} from '@nestjs/common';
import { CreateUserDto, ExpireNumberDto } from './dto/InputArgs';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { errorResponse, response, sendSlackNotification } from '../utils';
import {
	CreateUserValidationPipe,
	ExpireNumberValidationPipe,
} from './users.validations';
import { TellabotApiService } from '../tellabot-api/tellabot-api.service';
import {
	UserHistoryValidationPipe,
	UserProfileValidationPipe,
} from '../tellabot-api/tellabot-api.validations';
import { GetUserHistoryByIDDto } from '../tellabot-api/dto/InputArgs';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from '../payments/payments.service';
@ApiTags('users')
@Controller('users')
@ApiBearerAuth('x-token')
export class UsersController {
	constructor(
		private usersService: UsersService,
		private tellabotApiService: TellabotApiService,
		private paymentService: PaymentsService
	) {}

	@Post('sampleroute')
	async SampleRoute(
		@Body(new CreateUserValidationPipe()) input: CreateUserDto,
		@Req() req: Request,
		@Res() res: Response
	) {
		try {
			const data = await this.usersService.SampleRoute(input);
			if (data.success) {
				return response(
					req,
					res,
					data.success,
					data.data,
					data.message,
					data.status
				);
			}
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (err) {
			return errorResponse(
				req,
				res,
				false,
				err,
				'INTERNAL_SERVER_ERROR',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	@UseGuards(AuthGuard)
	@Post('/expirenumber')
	async expirenumber(
		@Body(new ExpireNumberValidationPipe()) input: ExpireNumberDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const user = await this.usersService.userprofile(req.user.id);
			const data = await this.tellabotApiService.expirenumber(
				input.requestID,
				input.is_flag
			);
			// sendSlackNotification(user.data, req, data.data);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			// console.log('error in user controller - expirenumber', error);
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ error }),
				'INTERNAL_SERVER_ERROR',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	@UseGuards(AuthGuard)
	@Get('activenumber')
	async getactivenumber(@Req() req: Request | any, @Res() res: Response) {
		try {
			const find_user_by_status = await this.usersService.CheckUserStatus(
				req.user.id
			);
			if (find_user_by_status && !find_user_by_status.active) {
				return errorResponse(
					req,
					res,
					false,
					"User Blocked by Admin",
					'INTERNAL_SERVER_ERROR',
					HttpStatus.INTERNAL_SERVER_ERROR
				);
			}
			const data = await this.tellabotApiService.activenumber(req.user.id);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			// console.log('error in uuser controller - getactivenumber', error);
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ error }),
				'INTERNAL_SERVER_ERROR',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	@UseGuards(AuthGuard)
	@Get('numberdata')
	async getnumberdata(@Req() req: Request | any, @Res() res: Response) {
		try {
			const data = await this.tellabotApiService.getNumberData(
				req.user.id,
				req.query.requestId
			);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ error }),
				'INTERNAL_SERVER_ERROR',
				HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}

	@UseGuards(AuthGuard)
	@Get('profile')
	async profile(@Req() req: Request | any, @Res() res: Response) {
		try {
			const data = await this.usersService.userprofile(req.user.id);
			return response(req, res, data.success, data.data, '', data.status);
		} catch (error) {
			// console.log('Error in Admin controller - profile', error);
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ err: error }),
				'INTERNAL_SERVER_ERROR',
				500
			);
		}
	}

	@UseGuards(AuthGuard)
	@Get('getpaymenthistory')
	async getpaymenthistory(
		@Query(new UserHistoryValidationPipe()) query: GetUserHistoryByIDDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.paymentService.getpaymenthistorybyID(
				query,
				req.user.id
			);
			return response(req, res, data.success, data.data, '', data.status);
		} catch (error) {
			// console.log('Error in user controller - getpaymenthistory', error);
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ err: error }),
				'INTERNAL_SERVER_ERROR',
				500
			);
		}
	}

	@UseGuards(AuthGuard)
	@Get('getuserhistory')
	async getuserhistory(
		@Query(new UserHistoryValidationPipe()) query: GetUserHistoryByIDDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.tellabotApiService.getuserhistorybyID(
				query,
				req.user.id
			);
			return response(req, res, data.success, data.data, '', data.status);
		} catch (error) {
			// console.log('Error in user controller - gethistorybyID', error);
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ err: error }),
				'INTERNAL_SERVER_ERROR',
				500
			);
		}
	}

	@UseGuards(AuthGuard)
	@Get('getrecentwebsite')
	async getrecentwebsite(@Req() req: Request | any, @Res() res: Response) {
		try {
			const data = await this.tellabotApiService.getrecentwebsite(req.user.id);
			return response(req, res, data.success, data.data, '', data.status);
		} catch (error) {
			// console.log('Error in user controller - getrecentwebsite', error);
			return errorResponse(
				req,
				res,
				false,
				JSON.stringify({ err: error }),
				'INTERNAL_SERVER_ERROR',
				500
			);
		}
	}
}
