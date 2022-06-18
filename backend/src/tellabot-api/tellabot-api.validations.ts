import { JoiValidationPipe } from '../utils';
import * as Joi from 'joi';
import {
	AutoServiceQueryDto,
	CreateServiceRequestDto,
	ReactivateTellabotNumberDto,
	ListTransactionDto,
	GetTransactionDto,
	ReactivateAutoServiceDto,
	CreateLTRDto,
	LTRAutoServiceDto,
	ReactivateLTRServiceDto,
	AutoRenewDto,
	GetUserHistoryByIDDto,
} from './dto/InputArgs';

export class ReactivateTellabotNumberValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<ReactivateTellabotNumberDto>({
			serviceId: Joi.string().required(),
			mdn: Joi.string().required(),
		});
	}
}

export class CreateServiceRequestValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<CreateServiceRequestDto>({
			serviceIds: Joi.array().items(Joi.string().required()).required(),
			is_reactivate: Joi.boolean(),
			is_ltr: Joi.boolean(),
			number: Joi.when('is_reactivate', {
				is: true,
				then: Joi.string().required(),
				otherwise: Joi.string(),
			}),
		});
	}
}

export class CreateLTRValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<CreateLTRDto>({
			serviceIds: Joi.string().required(),
		});
	}
}

export class LTRAutoServiceValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<LTRAutoServiceDto>({
			requestId: Joi.string().required(),
		});
	}
}

export class AutoServiceQueryValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<AutoServiceQueryDto>({
			serviceName: Joi.string().required(),
		});
	}
}

export class ListTransactionValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<ListTransactionDto>({
			search_data: Joi.string(),
			order_by: Joi.string(),
			order: Joi.boolean(),
			page: Joi.number(),
			limit: Joi.number(),
			filter_data: Joi.string(),
		});
	}
}

export class UserProfileValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<ListTransactionDto>({
			search_data: Joi.string(),
			order_by: Joi.string(),
			order: Joi.boolean(),
			page: Joi.number(),
			limit: Joi.number(),
		});
	}
}

export class UserHistoryValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<GetUserHistoryByIDDto>({
			search_data: Joi.string(),
			order_by: Joi.string(),
			order: Joi.boolean(),
			page: Joi.number(),
			limit: Joi.number(),
			filter_data: Joi.string(),
		});
	}
}

export class ReactivateAutoServiceValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<ReactivateAutoServiceDto>({
			serviceId: Joi.array().items(Joi.string().required()).required(),
			requestId: Joi.string().required(),
		});
	}
}

export class AutoRenewValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<AutoRenewDto>({
			requestId: Joi.string().required(),
			mdn: Joi.string().required(),
			autoRenew: Joi.boolean().required(),
		});
	}
}

export class ReactivateLTRServiceValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<ReactivateLTRServiceDto>({
			serviceId: Joi.array().items(Joi.string().required()).required(),
			requestId: Joi.string().required(),
		});
	}
}

export class GetTransactionValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<GetTransactionDto>({
			userid: Joi.string().required(),
			search_data: Joi.string(),
			order_by: Joi.string(),
			order: Joi.boolean(),
			page: Joi.number(),
			limit: Joi.number(),
			filter_data: Joi.string(),
		});
	}
}
