import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
	@ApiProperty({ required: true, example: '' })
	email: string;

	@ApiProperty({ required: true, example: '' })
	new_password: string;
}

export class ResetPasswordEmailDto {
	@ApiProperty({ required: true, example: '' })
	email: string;
}

export class VerifyOtpDto {
	@ApiProperty({ required: true, example: '' })
	email: string;

	@ApiProperty({ required: true, example: '' })
	code: string;
}

export class SignInDto {
	@ApiProperty({
		required: true,
		type: String,
		example: 'gauravbothra98@gmail.com',
	})
	email: string;

	@ApiProperty({
		required: true,
		type: String,
		example: '12345678',
	})
	password: string;

	@ApiProperty({
		required: true,
		type: String,
	})
	recaptcha: string;
}

export class AdminCustomerVerification {
	@ApiProperty({ required: true, type: String })
	code: string;

	@ApiProperty({ required: true, type: String })
	password: string;
}

export class SignUpDto {
	@ApiProperty({
		required: true,
		type: String,
		example: 'john.deo@example.com',
	})
	email: string;

	@ApiProperty({
		required: true,
		type: String,
		example: '12345678',
	})
	password: string;

	@ApiProperty({
		required: true,
		type: String,
		example: 'John Deo',
	})
	name: string;

	@ApiProperty({
		required: true,
		type: String,
		example: 'India',
	})
	country: string;

	@ApiProperty({
		required: true,
		type: String,
	})
	recaptcha: string;
}
