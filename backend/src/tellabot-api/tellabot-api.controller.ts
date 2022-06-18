import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Req,
	Res,
	UseGuards,
	Query,
} from '@nestjs/common';
import { Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { TellabotApiService } from './tellabot-api.service';
import { query, Request, Response } from 'express';
import { errorResponse, response, sendSlackNotification } from '../utils';
import {
	AutoRenewDto,
	AutoServiceQueryDto,
	CreateLTRDto,
	CreateServiceRequestDto,
	GetUserHistoryByIDDto,
	LTRAutoServiceDto,
	ReactivateAutoServiceDto,
	ReactivateTellabotNumberDto,
} from './dto/InputArgs';
import {
	ReactivateTellabotNumberValidationPipe,
	CreateServiceRequestValidationPipe,
	ReactivateAutoServiceValidationPipe,
	LTRAutoServiceValidationPipe,
	AutoRenewValidationPipe,
	UserHistoryValidationPipe,
} from './tellabot-api.validations';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from '../users/users.service';

@ApiTags('autoservices')
@ApiBearerAuth('x-token')
@Controller('autoservices')
export class TellabotApiController {
	constructor(
		private tellabotApiService: TellabotApiService,
		private usersService: UsersService
	) { }

	@UseGuards(AuthGuard)
	@Post('service/create')
	async CreateServiceRequest(
		@Query(new UserHistoryValidationPipe()) query: GetUserHistoryByIDDto,
		@Body(new CreateServiceRequestValidationPipe())
		input: CreateServiceRequestDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.tellabotApiService.CreateServiceRequest(
				input,
				req.user.id,
				req.user.email,
				req.user.name
			);
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
		} catch (error) {
			// console.log(
			// 	'🚀 ~ file: auth.controller.ts ~ line 92 ~ AuthController ~ error',
			// 	error
			// );
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
	@Post('service/checkAlreadyExist')
	async CheckAlreadyExist(
		@Query(new UserHistoryValidationPipe()) query: GetUserHistoryByIDDto,
		@Body(new CreateServiceRequestValidationPipe())
		input: CreateServiceRequestDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const maximumData = await this.tellabotApiService.verifyUserBlockStatus(
				req.user.email,
				input,
			);
			if (!maximumData.success) {
				return response(
					req,
					res,
					maximumData.success,
					maximumData.data,
					maximumData.message,
					maximumData.status
				);
			}
			return response(
				req,
				res,
				maximumData.success,
				maximumData.data,
				maximumData.message,
				maximumData.status
			);
		} catch (error) {
			// console.log(
			// 	'🚀 ~ file: auth.controller.ts ~ line 92 ~ AuthController ~ error',
			// 	error
			// );
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
	@ApiParam({ name: 'mdn' })
	@ApiParam({ name: 'serviceName' })
	@ApiParam({ name: 'requestId' })
	@Get('/LTRReadSms/:mdn/:serviceName/:requestId')
	async CreateLTRServiceRequest(
		@Param() param,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.tellabotApiService.LTRReamSMS(
				param.mdn,
				param.serviceName,
				param.requestId
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
			// console.log(
			// 	'🚀 ~ file: auth.controller.ts ~ line 92 ~ AuthController ~ error',
			// 	error
			// );
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
	@Post('service/LTRAutoService')
	async LTRAutoService(
		@Body(new LTRAutoServiceValidationPipe())
		input: LTRAutoServiceDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const user = await this.usersService.userprofile(req.user.id);
			const data = await this.tellabotApiService.LTRAutoService(input);
			// sendSlackNotification(user.data, req, data.data);
			return response(
				req,
				res,
				data.success,
				data.data.data,
				data.message,
				data.status
			);
		} catch (error) {
			// console.log(
			// 	'🚀 ~ file: auth.controller.ts ~ line 92 ~ AuthController ~ error',
			// 	error
			// );
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
	@Post('service/LTRAutoReNew')
	async LTRAutoRenew(
		@Body(new AutoRenewValidationPipe()) input: AutoRenewDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const user = await this.usersService.userprofile(req.user.id);
			const data = await this.tellabotApiService.ToggleAutoRenewLTR(input);
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
			// console.log(
			// 	'🚀 ~ file: auth.controller.ts ~ line 92 ~ AuthController ~ error',
			// 	error
			// );
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
	@Post('ReactivateAutoService')
	async ReactivateAutoService(
		@Body(new ReactivateAutoServiceValidationPipe())
		input: ReactivateAutoServiceDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.tellabotApiService.ReactivateAutoService(input);
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
		} catch (error) {
			// console.log(
			// 	'🚀 ~ file: auth.controller.ts ~ line 92 ~ AuthController ~ error',
			// 	error
			// );
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
	@ApiParam({ name: 'requestId' })
	@Post('/service/:requestId')
	async AutoService(
		@Param() param,
		@Body() input: any,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const user = await this.usersService.userprofile(req.user.id);
			const data = await this.tellabotApiService.AutoService(param.requestId,input);
			if (data.success) {
				// sendSlackNotification(user.data, req, data.data);
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
		} catch (error) {
			// console.log(
			// 	'🚀 ~ file: auth.controller.ts ~ line 92 ~ AuthController ~ error',
			// 	error
			// );
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
	@Post('/reactivate')
	async ReactivateTellabotNumber(
		@Body(new ReactivateTellabotNumberValidationPipe())
		input: ReactivateTellabotNumberDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.tellabotApiService.ReactivateTellabotNumber(
				input,
				req.user.id,
				req.user.email,
				req.user.name
			);
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
		} catch (error) { }
	}

	@ApiParam({ name: 'id' })
	@Delete('/AutoReleaseMdn/:id')
	async AutoReleaseMdn(
		@Param() param,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.tellabotApiService.AutoReleaseMdn(param.id);
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
		} catch (error) { }
	}

	@ApiParam({ name: 'mdn' })
	@ApiParam({ name: 'serviceName' })
	@ApiParam({ name: 'requestId' })
	@ApiParam({ name: 'messageId' })
	@Get('/ReadSms/:mdn/:serviceName/:requestId/:messageId')
	async AutoSmsRead(
		@Param() param,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.tellabotApiService.AutoSmsRead(
				param.mdn,
				param.serviceName,
				param.requestId,
				param.messageId
			);
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
		} catch (error) { }
	}

	@UseGuards(AuthGuard)
	@Post('LTRnumberActivate')
	async LTRnumberActivate(
		@Body() input: any,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {			
			const data = await this.tellabotApiService.activateLTRnumber(input);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			console.log(
				'🚀 error',
				error.message
			);
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
	@Post('LTRnumberStatusCheck')
	async LTRnumberStatusCheck(
		@Body() input: any,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {			
			const data = await this.tellabotApiService.LTRnumberStatusCheck(input);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			console.log(
				'🚀 error',
				error.message
			);
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
}
