import * as Joi from 'joi';

import {
	AddorUpdateCustomerDto,
	CreateUserDto,
	ExpireNumberDto,
	ListCustomerDto,
} from './dto/InputArgs';

import { JoiValidationPipe } from '../utils';

export class CreateUserValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<CreateUserDto>({
			name: Joi.string().required(),
			age: Joi.string().required(),
			breed: Joi.string().required(),
		});
	}
}

export class ExpireNumberValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<ExpireNumberDto>({
			requestID: Joi.string().required(),
			is_flag: Joi.boolean().required(),
		});
	}
}

export class AddorUpdateCustomerValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<AddorUpdateCustomerDto>({
			id: Joi.string(),
			name: Joi.string().required(),
			email: Joi.string().required(),
			country: Joi.string().required(),
			contact: Joi.string(),
			credits: Joi.number().required(),
			hold_credit: Joi.number().required(),
			skype: Joi.string().allow(null, ''),
			status: Joi.string().required(),
			usage: Joi.number().required(),
			user_type: Joi.string().required(),
			api_key: Joi.string().required(),
			active:Joi.boolean(),
		});
	}
}

export class ListCustomerValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<ListCustomerDto>({
			search_data: Joi.string(),
			order_by: Joi.string(),
			order: Joi.boolean(),
			page: Joi.number(),
			limit: Joi.number(),
		});
	}
}
