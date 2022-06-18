import {
	Controller,
	Get,
	Query,
	Req,
	Res,
	Post,
	Param,
	Body,
	HttpStatus,
	UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UsersService } from '../users/users.service';
import { errorResponse, response, sendSlackNotification } from '../utils';
import { Request, Response } from 'express';
import { boatServicesService } from '../boat-api/boat-services/boat-services.service';
import { boatApiService } from '../boat-api/boat-api.service';
import { PaymentsService } from '../payments/payments.service';
import { ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import {
	ListWebsiteDto,
	AddorUpdateWebsiteDto,
	DisableServiceDto,
} from '../boat-api/boat-services/dto/InputArgs';
import {
	ListCustomerDto,
	AddorUpdateCustomerDto,
} from '../users/dto/InputArgs';
import {
	AddorUpdateCustomerValidationPipe,
	ListCustomerValidationPipe,
} from '../users/users.validations';
import {
	AddorUpdateValidationPipe,
	ListWebsiteValidationPipe,
	DisableServicetValidationPipe,
} from '../boat-api/boat-services/boat-service.validations';
import {
	ListTransactionDto,
	GetTransactionDto,
} from '../boat-api/dto/InputArgs';
import { ListPaymentDto } from '../payments/dto/InputArgs';
import {
	ListTransactionValidationPipe,
	GetTransactionValidationPipe,
} from '../boat-api/boat-api.validations';
import { ListPaymentValidationPipe } from '../payments/payments.validations';
import { AdminSettingDto ,SignupmodeDto} from './dto/InputArgs';
import { MaintenanceValidationPipe,SignupValidationPipe } from './admin.validations';
import { AdminGuard, AuthGuard } from '../auth/auth.guard';

@ApiTags('Admin Panel')
@ApiBearerAuth('x-token')
@Controller('admin')
export class AdminController {
	constructor(
		private adminService: AdminService,
		private usersService: UsersService,
		private boatServicesService: boatServicesService,
		private boatApiService: boatApiService,
		private paymentService: PaymentsService
	) { }

	@Get('getmaintenancemode')
	async getmaintenance(@Req() req: Request | any, @Res() res: Response) {
		try {
			const data = await this.adminService.getmaintenancemode();
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			// console.log('Error in admin controller - getmaintenancemode', error);
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

	@UseGuards(AdminGuard)
	@Post('maintenancemode')
	async maintenancemode(
		@Body(new MaintenanceValidationPipe()) input: AdminSettingDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.adminService.maintenancemode(input);
			return response(req, res, data.success, {}, data.message, data.status);
		} catch (error) {
			// console.log('Error in admin controller - maintenancemode', error);
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

	@UseGuards(AdminGuard)
	@Post('signupmode')
	async signupmode(
		@Body(new SignupValidationPipe()) input: SignupmodeDto,
		@Req() req: Request | any,
		@Res() res: Response) {
		try {
			const data = await this.adminService.signupmode(input);
			return response(req, res, data.success, {}, data.message, data.status);
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

	@Get('getsignupmode')
	async getsignupmode(
		@Req() req: Request | any,
		@Res() res: Response) {
		try {
			const data = await this.adminService.getsignupmode();
			return response(req, res, data.success, data.data.data, data.message, data.status);
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

	@UseGuards(AdminGuard)
	@Post('disableservice')
	async disavleservice(
		@Body(new DisableServicetValidationPipe()) input: DisableServiceDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.boatServicesService.disableservice(input);
			return response(req, res, data.success, {}, data.message, data.status);
		} catch (error) {
			// console.log('Error in admin controller - disableservice', error);
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

	@UseGuards(AdminGuard)
	@Get('getallpayments')
	async getallpayments(
		@Query(new ListPaymentValidationPipe()) query: ListPaymentDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.paymentService.getallhistory(query);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			// console.log('Error in admin controller - getallpayments', error);
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

	@UseGuards(AdminGuard)
	@Get('gethistorybyID')
	async gethistorybyID(
		@Query(new GetTransactionValidationPipe()) query: GetTransactionDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.boatApiService.gethistorybyID(query);
			return response(req, res, data.success, data.data, '', data.status);
		} catch (error) {
			// console.log('Error in Admin controller - gethistorybyID', error);
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

	@UseGuards(AdminGuard)
	@Get('getallhistory')
	async getalltransaction(
		@Query(new ListTransactionValidationPipe()) query: ListTransactionDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.boatApiService.getallhistory(query);
			return response(req, res, data.success, data.data, '', data.status);
		} catch (error) {
			// console.log('Error in Admin controller - getalltransaction', error);
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

	@UseGuards(AdminGuard)
	@ApiParam({ name: 'id' })
	@Post('deletecustomer/:id')
	async deletecustomer(
		@Param() param,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.usersService.DeleteCustomer(param.id);
			if (data) {
				return response(
					req,
					res,
					true,
					{},
					'Customer Successfully deleted',
					HttpStatus.OK
				);
			} else {
				return response(
					req,
					res,
					false,
					{},
					'Error in deleting customer',
					HttpStatus.NOT_FOUND
				);
			}
		} catch (error) {
			// console.log('error in admincontroller - deletewebsite', error);
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

	@UseGuards(AdminGuard)
	@Get('getCustomer')
	async getCustomer(
		@Query(new ListCustomerValidationPipe()) query: ListCustomerDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.usersService.GetAllCustomers(query);
			return response(req, res, data.success, data.data, '', data.status);
		} catch (error) {
			// console.log('Error in Admin controller - getWebsite', error);
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

	@UseGuards(AdminGuard)
	@Post('addorupdatecustomer')
	async addorupdatecustomer(
		@Body(new AddorUpdateCustomerValidationPipe())
		input: AddorUpdateCustomerDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const user = await this.usersService.GetUsersCreditById(input.id);
			if (input.id) {
				if (input.credits !== user.credits) {
					const data = await this.paymentService.ChangeFundsByAdmin(
						input.credits - user.credits,
						user
					);
				}
			}
			const requestedUser = await this.usersService.userprofile(req.user.id);
			const data = await this.usersService.AddorUpdateCustomer(input);
			// sendSlackNotification(requestedUser, req, {
			// 	user_id: user.id,
			// 	user_name: user.name,
			// 	user_credits: user.credits,
			// 	message: 'UPDATED BY ADMIN',
			// 	creditsUpdated: input.credits - user.credits,
			// });
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			// console.log('Error in Admin controller - addorupdatewebsite', error);
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

	@UseGuards(AdminGuard)
	@ApiParam({ name: 'id' })
	@Post('deletewebsite/:id')
	async deletewebsite(
		@Param() param,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.boatServicesService.DeleteWebsite(param.id);
			if (data) {
				return response(
					req,
					res,
					true,
					{},
					'Website Successfully deleted',
					HttpStatus.OK
				);
			} else {
				return response(
					req,
					res,
					false,
					{},
					'Error in deleting website',
					HttpStatus.NOT_FOUND
				);
			}
		} catch (error) {
			// console.log('error in admincontroller - deletewebsite', error);
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

	@UseGuards(AdminGuard)
	@Post('addorupdatewebsite')
	async addorupdatewebsite(
		@Body(new AddorUpdateValidationPipe()) input: AddorUpdateWebsiteDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.boatServicesService.AddorUpdateWebsite(input);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			// console.log('Error in Admin controller - addorupdatewebsite', error);
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

	@UseGuards(AdminGuard)
	@Get('getWebsite')
	async getWebsite(
		@Query(new ListWebsiteValidationPipe()) query: ListWebsiteDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.boatServicesService.GetAllServices(query);
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			// console.log('Error in Admin controller - getWebsite', error);
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

	@UseGuards(AdminGuard)
	@Get('getDashboard')
	async getDashboard(@Req() req: Request | any, @Res() res: Response) {
		try {
			const users = this.usersService.GetUserCount();
			const website = this.boatServicesService.GetServiceCount();
			return Promise.all([users, website]).then(function (data) {
				return response(
					req,
					res,
					true,
					{
						usercount: data[0],
						websitecount: data[1],
					},
					'',
					HttpStatus.OK
				);
			});
		} catch (error) {
			// console.log('Error in admin controller', error);
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

	@Post('addOrUpdatePaypalEmail')
	async addOrUpdatePaypalEmail(
		@Body() input,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.adminService.addOrUpdateEmail(input);
			return response(req, res, data.success, {}, data.message, data.status);
		} catch (error) {
			// console.log('Error in admin controller - maintenancemode', error);
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

	@Get('getpaypalemail')
	async getPaypalEmail(@Req() req: Request | any, @Res() res: Response) {
		try {
			const data = await this.adminService.getpaypalemail();
			return response(
				req,
				res,
				data.success,
				data.data,
				data.message,
				data.status
			);
		} catch (error) {
			// console.log('Error in admin controller - getmaintenancemode', error);
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
	@Post('addOrUpdateNotice')
	async addOrUpdateNotice(
		@Body() input,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.adminService.addOrUpdateNotice(input);
			return response(req, res, data.success, {}, data.message, data.status);
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

	@UseGuards(AuthGuard)
	@Get('getNotice')
	async getallNotice(
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.adminService.getNotice();
			return response(req, res, data.success, data.data, data.message, data.status);
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


}
