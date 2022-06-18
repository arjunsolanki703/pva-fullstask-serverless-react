import { ApiProperty } from '@nestjs/swagger';

export class DeleteNewsDto {
	@ApiProperty({ required: true, type: String })
	id: string;
}

export class ListNewsDto {
	@ApiProperty({ required: false, example: '' })
	search_data: string;

	@ApiProperty({ required: false, example: 'createdAt' })
	order_by: string;

	@ApiProperty({ required: false, example: 'true' })
	order: boolean;

	@ApiProperty({ required: false, example: '1' })
	page: number;

	@ApiProperty({ required: false, example: '10' })
	limit: number;
}

export class AddOrUpdateNewsDto {
	@ApiProperty({ required: false, example: '0' })
	id: number;

	@ApiProperty({ required: false, type: String })
	title: string;

	@ApiProperty({ required: false, type: String })
	description: string;
}
