import { i18nMessageCode } from '../../shared';
import * as moment from 'moment';
export const response = async (
	req: any,
	res: any,
	success = true,
	data: any = {},
	message = '',
	statusCode = 200
) => {
	const resData = {
		success: success,
		statusCode: statusCode,
		message: i18nMessageCode(message),
		data,
		messageCode: message,
		path: req.originalUrl,
		timestamp: moment.utc(new Date()).format('x'),
	};
	return res.status(statusCode).json(resData).end();
};

export const errorResponse = async (
	req: any,
	res: any,
	success = true,
	error: any = {},
	message = '',
	statusCode = 400
) => {
	const resData = {
		success: success,
		statusCode: statusCode,
		message: i18nMessageCode(message),
		error: error,
		messageCode: message,
		path: req.originalUrl,
		timestamp: moment.utc(new Date()).format('x'),
	};
	return res.status(statusCode).json(resData).end();
};
