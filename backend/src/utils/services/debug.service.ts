import axios from 'axios';
import { NODE_ENV, LOGGING } from '../../environments';
export const sendSlackNotification = async (
	user: any,
	req: any,
	data_: any
): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		// console.debug(LOGGING);
		if (LOGGING === 'false') {
			return resolve(true);
		}
		try {
			const url =
				NODE_ENV === 'development'
					? 'https://hooks.slack.com/services/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'
					: 'https://hooks.slack.com/services/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';

			const data = {
				ip: req.apiGateway.context.sourceIp,
				user_id: user.id,
				name: user.name,
				credits: user.credits,
				url: req.path,
				data: JSON.stringify(data_),
			};

			await axios.post(url, {
				text: JSON.stringify(data),
			});
			return resolve(true);
		} catch (err) {
			return reject(err);
		}
	});
};
