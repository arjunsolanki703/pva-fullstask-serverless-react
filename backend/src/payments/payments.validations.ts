import { JoiValidationPipe } from '../utils';
import * as Joi from 'joi';
import { AddFundsDto, ListPaymentDto, PaymentStatusDto } from './dto/InputArgs';
import { __PROD__ } from '../environments';

export class AddFundsValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<AddFundsDto>({
			amount: Joi.number().required(),
			currency: !__PROD__
				? Joi.string()
						.valid(
							'BTC',
							'LTC',
							'BCH',
							'BNB',
							'DASH',
							'DGB',
							'DOGE',
							'ETC',
							'ETH',
							'NEO',
							'USDT.ERC20',
							'XEM',
							'XMR',
							'XRP',
							'LTCT'
						)
						.required()
				: Joi.string()
						.valid(
							'BTC',
							'LTC',
							'BCH',
							'BNB',
							'DASH',
							'DGB',
							'DOGE',
							'ETC',
							'ETH',
							'NEO',
							'USDT.ERC20',
							'XEM',
							'XMR',
							'XRP',
							'LTCT'
						)
						.required(),
			coinid: Joi.when('currency', {
				is: 'LTCT',
				then: Joi.string(),
				otherwise: Joi.string().valid('litecoin', 'bitcoin').required(),
			}),
			// coinid: Joi.string().valid('bitcoin', 'litecoin').required(),
		});
	}
}

export class ListPaymentValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<ListPaymentDto>({
			search_data: Joi.string(),
			order_by: Joi.string(),
			order: Joi.boolean(),
			page: Joi.number(),
			limit: Joi.number(),
			filter_data: Joi.string(),
		});
	}
}
export class PaymentStatusValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<PaymentStatusDto>({
			id: Joi.string().required(),
		});
	}
}
