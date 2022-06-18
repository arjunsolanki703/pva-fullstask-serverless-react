import { ApiProperty } from '@nestjs/swagger';

export class AdminSettingDto {
	@ApiProperty({ required: true, example: '' })
	maintenance: boolean;

	@ApiProperty({ required: false, example: '' })
	message: string;

	@ApiProperty({required:false})
	signupmode:boolean;
}

export class SignupmodeDto {
	@ApiProperty({required:false})
	signupmode:boolean;
}
