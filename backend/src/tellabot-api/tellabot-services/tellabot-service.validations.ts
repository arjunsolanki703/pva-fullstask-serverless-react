import * as Joi from 'joi';

import {
	AddorUpdateWebsiteDto,
	DisableServiceDto,
	ListWebsiteDto,
} from './dto/InputArgs';

import { JoiValidationPipe } from '../../utils';

export class DisableServicetValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<DisableServiceDto>({
			serviceIds: Joi.array().items(Joi.string().required()).required(),
		});
	}
}

export class AddorUpdateValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<AddorUpdateWebsiteDto>({
			id: Joi.string(),
			name: Joi.string().required(),
			custom_name: Joi.string().optional(),
			credit: Joi.number().required(),
			enable: Joi.boolean().required(),
			enable_ltr:Joi.boolean().required(),
			tellabot: Joi.boolean().required(),
			agent_accept_time: Joi.string(),
			agent_handle_request: Joi.boolean(),
			is_price_surge: Joi.boolean().required(),
			price_after_surge: Joi.number().required(),
			ltr_price: Joi.number().required(),
		});
	}
}

export class ListWebsiteValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<ListWebsiteDto>({
			search_data: Joi.string(),
			page: Joi.number(),
			limit: Joi.number(),
			order_by: Joi.string(),
			order: Joi.boolean(),
			filter_data: Joi.boolean(),
		});
	}
}
