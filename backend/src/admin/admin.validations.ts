import { JoiValidationPipe } from '../utils';
import * as Joi from 'joi';
import { __PROD__ } from '../environments';
import { AdminSettingDto ,SignupmodeDto} from './dto/InputArgs';
import { join } from 'path';

export class MaintenanceValidationPipe extends JoiValidationPipe {
	public buildSchema(): Joi.Schema {
		return Joi.object<AdminSettingDto>({
			maintenance: Joi.boolean().required(),
			message: Joi.string(),
			signupmode:Joi.boolean().required(),
		});
	}
}

export class SignupValidationPipe extends JoiValidationPipe{
	public buildSchema(): Joi.Schema {
		return Joi.object<SignupmodeDto>({
			signupmode:Joi.boolean().required()
		});
	}
}
