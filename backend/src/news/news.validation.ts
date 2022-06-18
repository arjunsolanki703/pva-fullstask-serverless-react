import { JoiValidationPipe } from '../utils';
import * as Joi from 'joi';
import {
	AddOrUpdateNewsDto,
	DeleteNewsDto,
	ListNewsDto,
} from './dto/inputArgs';
export class AddOrUpdateNewsValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<AddOrUpdateNewsDto>({
			id: Joi.string(),
			title: Joi.string(),
			description: Joi.string(),
		});
	}
}
export class DeleteNewsValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<DeleteNewsDto>({
			id: Joi.string(),
		});
	}
}
export class ListNewsValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<ListNewsDto>({
			search_data: Joi.string(),
			order_by: Joi.string(),
			order: Joi.boolean(),
			page: Joi.number(),
			limit: Joi.number(),
		});
	}
}
