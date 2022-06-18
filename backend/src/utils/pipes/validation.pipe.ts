import * as Joi from 'joi';
import {
	HttpException,
	HttpStatus,
	Injectable,
	PipeTransform,
} from '@nestjs/common';

@Injectable()
export abstract class JoiValidationPipe implements PipeTransform<unknown> {
	public transform(value: unknown): unknown {
		const result = this.buildSchema().validate(value, { abortEarly: false });

		if (result.error) {
			throw new HttpException(
				{
					message: 'VALIDATION_ERROR',
					detail: result.error,
					statusCode: HttpStatus.FORBIDDEN,
				},
				HttpStatus.FORBIDDEN
			);
		}

		return result.value;
	}

	public abstract buildSchema(): Joi.Schema;
}
