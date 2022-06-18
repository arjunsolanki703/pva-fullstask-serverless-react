import { ApiProperty } from '@nestjs/swagger';

export class TicketDto {
	@ApiProperty({
		required: true,
		type: String,
	})
	subject: string;

	@ApiProperty({
		required: true,
		type: String,
	})
	message: string;

    @ApiProperty({
		required: true,
		type: String,
	})
	recaptcha: string;
}


export class RespondDto{
	@ApiProperty({
		required: true,
		type: String,
	})
	ticket_id: string;

    @ApiProperty({
		required: true,
		type: String,
	})
	message: string;
}

export class GetticketDto{
    @ApiProperty({
		required: true,
		type: String,
	})
	status: string;
}

export class FindticketDto{
	@ApiProperty({
		required: true,
		type: String,
	})
	id: string;
}

export class UpdateticketDto{
	@ApiProperty({
		required: true,
		type: String,
	})
	id: string;
}

export class GetallticketDto{
	@ApiProperty({
		required: true,
		type: String,
	})
	status: string;
}

export class CreatebyadminticketDto{
	@ApiProperty({
		required: true,
		type: String,
	})
	subject: string;
	@ApiProperty({
		required: true,
		type: String,
	})
	customer_id: string;

	@ApiProperty({
		required: true,
		type: String,
	})
	message: string;
}