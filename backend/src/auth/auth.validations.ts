import { JoiValidationPipe } from '../utils';
import * as Joi from 'joi';
import {
	SignInDto,
	SignUpDto,
	ResetPasswordDto,
	VerifyOtpDto,
	ResetPasswordEmailDto,
	AdminCustomerVerification,
} from './dto/InputArgs';

export class ResetPasswordValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<ResetPasswordDto>({
			email: Joi.string().required(),
			new_password: Joi.string().required(),
		});
	}
}

export class VerifyOtpValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<VerifyOtpDto>({
			email: Joi.string().required(),
			code: Joi.string().required(),
		});
	}
}

export class ResetPasswordEmailValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<ResetPasswordEmailDto>({
			email: Joi.string().required(),
		});
	}
}

export class AdminCustomerVerificationValidatePipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<AdminCustomerVerification>({
			code: Joi.string().required(),
			password: Joi.string().required(),
		});
	}
}

export class SignInValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<SignInDto>({
			email: Joi.string().required(),
			password: Joi.string().required(),
			recaptcha: Joi.string().required(),
		});
	}
}

export class SignUpValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<SignUpDto>({
			email: Joi.string().required(),
			password: Joi.string().required(),
			name: Joi.string().required(),
			country: Joi.string().required(),
			recaptcha: Joi.string().required(),
		});
	}
}
