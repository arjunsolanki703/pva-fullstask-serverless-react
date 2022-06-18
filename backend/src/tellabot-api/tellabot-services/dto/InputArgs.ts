import { ApiProperty } from '@nestjs/swagger';

export class ListWebsiteDto {
	@ApiProperty({ required: false, example: '' })
	search_data: string;

	@ApiProperty({ required: false, example: '1' })
	page: number;

	@ApiProperty({ required: false, example: '10' })
	limit: number;

	@ApiProperty({ required: false, example: 'name' })
	order_by: string;

	@ApiProperty({ required: false, example: 'ASC' })
	order: boolean;

	@ApiProperty({ required: false })
	filter_data: boolean;
}

export class DisableServiceDto {
	@ApiProperty({ required: true, type: [String] })
	serviceIds: [string];
}

export class AddorUpdateWebsiteDto {
	@ApiProperty({ required: false, example: '' })
	id: string;
	@ApiProperty({ required: true, example: '' })
	name: string;
	@ApiProperty({ required: false, example: '' })
	custom_name: string;
	@ApiProperty({ required: true, example: '' })
	credit: number;
	@ApiProperty({ required: true, example: '' })
	enable: boolean;
	@ApiProperty({ required: true, example: '' })
	enable_ltr: boolean;
	@ApiProperty({ required: true, example: '' })
	tellabot: boolean;
	@ApiProperty({ required: true, example: '' })
	agent_accept_time: string;
	@ApiProperty({ required: true, example: '' })
	agent_handle_request: boolean;
	@ApiProperty({ required: true, example: '' })
	is_price_surge: boolean;
	@ApiProperty({ required: true, example: '' })
	price_after_surge: number;
	@ApiProperty({ required: true, example: '' })
	ltr_price: number;
}
