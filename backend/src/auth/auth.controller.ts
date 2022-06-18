import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Put,
	Req,
	Res,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { errorResponse, response } from '../utils';
import { UsersService } from '../users/users.service';
import {
	SignInValidationPipe,
	SignUpValidationPipe,
	ResetPasswordValidationPipe,
	ResetPasswordEmailValidationPipe,
	VerifyOtpValidationPipe,
	AdminCustomerVerificationValidatePipe,
} from './auth.validations';
import {
	SignInDto,
	SignUpDto,
	ResetPasswordDto,
	ResetPasswordEmailDto,
	VerifyOtpDto,
	AdminCustomerVerification,
} from './dto/InputArgs';
import { Request, Response } from 'express';
import { Recaptcha } from '@nestlab/google-recaptcha';
import { AdminService } from '../admin/admin.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private userService: UsersService, private adminService: AdminService) { }

	@Post('resetpasswordemail')
	async ResetPasswordEmail(
		@Body(new ResetPasswordEmailValidationPipe()) input: ResetPasswordEmailDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.userService.resetpasswordemail(input);
			return response(req, res, data.success, {}, data.message, data.status);
		} catch (error) {
			// console.log('Error in auth controller - resetpasswordemail', error);
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

	@Post('verifyotp')
	async VerifyOtp(
		@Body(new VerifyOtpValidationPipe()) input: VerifyOtpDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.userService.verifyotp(input);
			return response(req, res, data.success, {}, data.message, data.status);
		} catch (error) {
			// console.log('Error in auth controller - verifyotp', error);
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

	@Post('resetpassword')
	async ResetPassword(
		@Body(new ResetPasswordValidationPipe()) input: ResetPasswordDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.userService.resetpassword(input);
			return response(req, res, data.success, {}, data.message, data.status);
		} catch (error) {
			// console.log('Error in auth controller - resetpassword', error);
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

	@ApiResponse({ status: 400, description: 'Validation Error!' })
	@ApiResponse({ status: 200, description: 'User Login Successfully!' })
	@ApiResponse({ status: 401, description: 'Invalid User Credential!' })
	@ApiResponse({ status: 404, description: 'User Not Found!' })
	@Recaptcha({ response: (req) => req.body.recaptcha })
	@Post('/SignIn')
	async SignIn(
		@Body(new SignInValidationPipe()) input: SignInDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.userService.SignIn(input);
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

	@ApiResponse({ status: 400, description: 'Validation Error!' })
	@ApiResponse({
		status: 200,
		description: 'User Account Created Successfully!',
	})
	@ApiResponse({
		status: HttpStatus.NOT_ACCEPTABLE,
		description: 'Account with same email address is alredy exists!',
	})
	@Recaptcha({ response: (req) => req.body.recaptcha })
	@Post('/SignUp')
	async SignUp(
		@Body(new SignUpValidationPipe()) input: SignUpDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.userService.SignUp(input);
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

	@Post('/AdminCustomerVerification')
	async admincustomerverify(
		@Body(new AdminCustomerVerificationValidatePipe())
		input: AdminCustomerVerification,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const result = await this.userService.admincustomerverify(input);
			return response(
				req,
				res,
				result.success,
				result.data,
				result.message,
				result.status
			);
		} catch (error) {
			// console.log(error);
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

	@ApiParam({ name: 'verificationCode' })
	@Put('/VerifyAccount/:verificationCode')
	async VerifyAccount(
		@Param() param,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.userService.VerifyAccount(param.verificationCode);
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
}
