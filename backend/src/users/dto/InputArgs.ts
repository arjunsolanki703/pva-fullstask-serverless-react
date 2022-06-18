import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
	@ApiProperty()
	name: string;

	@ApiProperty()
	age: number;

	@ApiProperty()
	breed: string;
}

export class LoginDto {
	@ApiProperty()
	email;
}

export class ListCustomerDto {
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
}

export class ExpireNumberDto {
	@ApiProperty({ required: false, type: String })
	requestID: string;

	@ApiProperty({ required: false, type: Boolean })
	is_flag: boolean;
}

export class AddorUpdateCustomerDto {
	@ApiProperty({ required: false, type: String })
	id: string;

	@ApiProperty({ required: true, type: String })
	name: string;

	@ApiProperty({ required: true, type: String })
	email: string;

	@ApiProperty({ required: true, type: String })
	country: string;

	@ApiProperty({ required: false, type: String })
	contact: string;

	@ApiProperty({ required: true, type: Number })
	credits: number;

	@ApiProperty({ required: true, type: Number })
	hold_credit: number;

	@ApiProperty({ required: true, type: String })
	skype: string;

	@ApiProperty({ required: true, type: String })
	status: string;

	@ApiProperty({ required: true, type: Number })
	usage: number;

	@ApiProperty({ required: true, type: String })
	user_type: string;

	@ApiProperty({ required: true, type: String })
	api_key: string;

	@ApiProperty({ required: true, type: Boolean })
	active: boolean;
}
