import { ApiProperty, ApiQuery } from '@nestjs/swagger';

export class ReactivateTellabotNumberDto {
	@ApiProperty({ required: true, type: String })
	serviceId: string;

	@ApiProperty({ required: true, type: String, example: '1503204' })
	mdn: string;
}

export class AutoRenewDto {
	@ApiProperty({ required: true, type: String })
	requestId: string;

	@ApiProperty({ required: true, type: String, example: '1503204' })
	mdn: string;

	@ApiProperty({ required: true, type: Boolean })
	autoRenew: boolean;
}

export class CreateServiceRequestDto {
	@ApiProperty({ required: true, type: [String] })
	serviceIds: [string];

	@ApiProperty({ required: false, type: Boolean, default: false })
	is_reactivate: boolean;

	@ApiProperty({ required: false, type: Boolean, default: false })
	is_ltr: boolean;

	@ApiProperty({ required: false, type: String, default: '' })
	number: string;
}

export class CreateLTRDto {
	@ApiProperty({ required: true, type: String })
	serviceIds: string;
}

export class LTRAutoServiceDto {
	@ApiProperty({ required: true, type: String })
	requestId: string;
}

export class ReactivateAutoServiceDto {
	@ApiProperty({ required: true, type: [String] })
	serviceId: [string];

	@ApiProperty({ required: true, type: String })
	requestId: string;
}

export class ReactivateLTRServiceDto {
	@ApiProperty({ required: true, type: [String] })
	serviceId: [string];

	@ApiProperty({ required: true, type: String })
	requestId: string;
}

export class AutoServiceQueryDto {
	@ApiProperty({ required: true, type: [String] })
	serviceName: [string];
}

export class GetTransactionDto {
	@ApiProperty({ required: true, example: '' })
	userid: string;

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

export class GetUserHistoryByIDDto {
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

export class ListTransactionDto {
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
