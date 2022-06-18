import {
	Query,
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminGuard, AuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';
import { NewsService } from './news.service';
import {
	AddOrUpdateNewsValidationPipe,
	DeleteNewsValidationPipe,
	ListNewsValidationPipe,
} from './news.validation';
import {
	AddOrUpdateNewsDto,
	DeleteNewsDto,
	ListNewsDto,
} from './dto/inputArgs';
import { errorResponse, response } from '../utils';
import { UsersService } from '../users/users.service';

@ApiTags('news')
@ApiBearerAuth('x-token')
@Controller('news')
export class NewsController {
	constructor(
		private newsService: NewsService,
		private userService: UsersService
	) {}

	@UseGuards(AuthGuard)
	@Get('get')
	async getCustomer(
		@Query(new ListNewsValidationPipe()) query: ListNewsDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.newsService.getAllNews(req.user.id, query);
			return response(req, res, data.success, data.data, '', data.status);
		} catch (error) {
			// console.log('Error in News controller - getNews', error);
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
	@Post('addorupdate')
	async addOrUpdate(
		@Body(new AddOrUpdateNewsValidationPipe()) input: AddOrUpdateNewsDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			// notifing all user that add or update in news has occured
			await this.userService.addNews();
			const data = await this.newsService.addOrUpdateNews(input);
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
			// 	'🚀 ~ file: news.controller.ts ~ line 80 ~ NewsController ~ error',
			// 	error
			// );
		}
	}

	@UseGuards(AdminGuard)
	@Post('delete')
	async deleteNews(
		@Body(new DeleteNewsValidationPipe()) input: DeleteNewsDto,
		@Req() req: Request | any,
		@Res() res: Response
	) {
		try {
			const data = await this.newsService.deleteNews(input);
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
			// 	'🚀 ~ file: news.controller.ts ~ line 116 ~ NewsController ~ error',
			// 	error
			// );
		}
	}
}
