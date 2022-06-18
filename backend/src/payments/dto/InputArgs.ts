import { ApiProperty } from '@nestjs/swagger';

export class AddFundsDto {
	@ApiProperty({ required: true, type: Number })
	amount: number;

	@ApiProperty({
		required: true,
		type: String,
		enum: [
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
			'LTCT',
		],
	})
	currency: string;

	@ApiProperty({
		required: true,
		type: String,
		enum: ['bitcoin', 'litecoin'],
	})
	coinid: string;
}

export class ListPaymentDto {
	@ApiProperty({ required: false, example: '' })
	search_data: string;

	@ApiProperty({ required: false, example: 'name' })
	order_by: string;

	@ApiProperty({ required: false, example: 'ASC' })
	order: boolean;

	@ApiProperty({ required: false, example: '1' })
	page: number;

	@ApiProperty({ required: false, example: '10' })
	limit: number;

	@ApiProperty({ required: false, example: '10' })
	filter_data: string;
}

export class PaymentStatusDto {
	@ApiProperty({ required: true, type: String })
	id: string;
}