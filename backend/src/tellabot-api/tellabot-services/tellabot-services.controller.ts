import { Controller, Get, HttpStatus, Req, Res, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { errorResponse, response } from '../../utils';
import { TellabotServicesService } from './tellabot-services.service';
import { Request, Response } from 'express';
import { ListWebsiteDto } from './dto/InputArgs';
import { ListWebsiteValidationPipe } from './tellabot-service.validations';

@ApiTags('Tellabot-Services')
@Controller('tellabot-services')
export class TellabotServicesController {
	constructor(private tellabotServices: TellabotServicesService) {}
	@Get('/get/all')
	async GetAllTellabotServices(
		@Query(new ListWebsiteValidationPipe()) query: ListWebsiteDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.tellabotServices.GetAllServices(query);
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

	@Get('/addServicesSeed')
	async AddServiceSeeds() {
		try {
			const data = await this.tellabotServices.AddServiceSeeds();
			return data;
		} catch (error) {}
	}
}
