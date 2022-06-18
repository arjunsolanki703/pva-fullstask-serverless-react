import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { errorResponse } from '../../utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse<Response>();
		const req = ctx.getRequest<Request>();
		const status = exception.getStatus();
		const errorMessage: any = exception.getResponse();

		return errorResponse(
			req,
			res,
			false,
			errorMessage.error || errorMessage.detail,
			errorMessage.message,
			errorMessage.statusCode
		);
	}
}
