import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import { ServiceResponseInterface } from '../utils';
import { News, NewsDocument } from './news.model';
import {
	DeleteNewsDto,
	ListNewsDto,
	AddOrUpdateNewsDto,
} from './dto/inputArgs';
import { UsersService } from '../users/users.service';
@Injectable()
export class NewsService {
	constructor(
		@InjectModel(News.name) private newsServiceModel: Model<NewsDocument>,
		private userService: UsersService
	) {}
	async addOrUpdateNews(
		input: AddOrUpdateNewsDto
	): Promise<ServiceResponseInterface> {
		const _id = new mongo.ObjectID(input.id);
		const data = await this.newsServiceModel.findOne({
			_id: _id,
		});
		// update news
		if (data) {
			input['updatedAt'] = new Date().toISOString();
			const news = await this.newsServiceModel.updateOne({ _id: _id }, input);
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'NEWS_UPDATED_SUCCESSFULLT',
				data: { id: input.id },
			};
		}
		// add news
		else {
			input['createdAt'] = new Date().toISOString();
			const news = await this.newsServiceModel.create(input);
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'NEWS_ADDED_SUCCESSFULLY',
				data: { id: news._id },
			};
		}
	}

	async deleteNews(input: DeleteNewsDto): Promise<ServiceResponseInterface> {
		const _id = new mongo.ObjectID(input.id);
		const data = await this.newsServiceModel.deleteOne({
			_id: _id,
		});
		return {
			success: true,
			status: HttpStatus.OK,
			message: '',
			data: { data: data, message: 'NEWS_DELETED_SUCCESSFULLY' },
		};
	}

	async getAllNews(
		id: string,
		query: ListNewsDto
	): Promise<ServiceResponseInterface> {
		await this.userService.readNews(id);

		const search_data = query.search_data ? query.search_data : '';
		const limit = query.limit ? Number(query.limit) : 10;
		const page = query.page ? Number(query.page) : 1;
		const skip = limit * (page - 1);
		const order_by = query.order_by ? query.order_by : 'name';
		const order = query.order ? 1 : -1;

		let data = await this.newsServiceModel
			.find({
				$or: [
					{ title: { $regex: search_data, $options: 'i' } },
					{ description: { $regex: search_data, $options: 'i' } },
				],
			})
			.sort([[order_by, order]])
			.skip(skip)
			.limit(limit);

		const totalNews = await this.newsServiceModel.countDocuments({
			$or: [
				{ title: { $regex: search_data, $options: 'i' } },
				{ description: { $regex: search_data, $options: 'i' } },
			],
		});

		return {
			success: true,
			status: HttpStatus.OK,
			message: '',
			data: { data: data, totalNews: totalNews },
		};
	}
}
