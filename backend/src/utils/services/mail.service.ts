import * as ejs from 'ejs';
import * as nodemailer from 'nodemailer';

import {
	FROM_MAIL,
	IAM_USER_ACCESS_KEY_ID,
	IAM_USER_SECRET_KEY,
	MAILING_PASSWORD,
	MAILING_SERVICE,
	MAILING_USERNAME,
	SES_REGION,
	__PROD__,
} from '../../environments';
import { S3, SES } from 'aws-sdk';

import { join } from 'path';

// const transporter = __PROD__
// 	? nodemailer.createTransport({
// 			// SES: new SES({
// 			// 	apiVersion: '2010-12-01',
// 			// 	region: SES_REGION,
// 			// 	accessKeyId: IAM_USER_ACCESS_KEY_ID,
// 			// 	secretAccessKey: IAM_USER_SECRET_KEY,
// 			// }),
// 			host: 'server202.web-hosting.com',
// 			port: 465,
// 			secure: true,
// 			auth: {
// 				user: MAILING_USERNAME,
// 				pass: MAILING_PASSWORD,
// 			},
// 	  })
// 	: nodemailer.createTransport({
// 			// service: MAILING_SERVICE,
// 			host: 'server202.web-hosting.com',
// 			port: 465,
// 			secure: true,
// 			auth: {
// 				user: MAILING_USERNAME,
// 				pass: MAILING_PASSWORD,
// 			},
// 	  });

/**
 * A helper function is used to send email from Amazon SES
 * @param {[string]} recipient - A list to recipient to send email.
 * @param {string} from - From which email address to send.
 * @param {string} subject - Subject of email.
 * @param {string} msg - Dynamic Data msg to send in email.
 * @param {boolean} is_bulk - A Boolean variable is used to determine wheather sending same data to all recipient or not.
 * @param {string} cc - CC address.
 * @param {string} BCC - BCC address.
 * @return {boolean} - return promise of boolean.
 */
export const sendEmail = async (
	recipient: [string],
	subject: string,
	cc?: string,
	bcc?: string,
	template?: string,
	html?: string,
	from_ticket?: boolean
): Promise<boolean> => {
	const transporter = __PROD__
		? from_ticket
			? nodemailer.createTransport({
					host: 'server202.web-hosting.com',
					port: 465,
					secure: true,
					auth: {
						user: MAILING_USERNAME,
						pass: MAILING_PASSWORD,
					},
			  })
			: nodemailer.createTransport({
					SES: new SES({
						apiVersion: '2010-12-01',
						region: SES_REGION,
						accessKeyId: IAM_USER_ACCESS_KEY_ID,
						secretAccessKey: IAM_USER_SECRET_KEY,
					}),
			  })
		: nodemailer.createTransport({
				// service: MAILING_SERVICE,
				host: 'server202.web-hosting.com',
				port: 465,
				secure: true,
				auth: {
					user: MAILING_USERNAME,
					pass: MAILING_PASSWORD,
				},
		  });
		  
	return new Promise(async (resolve, reject) => {
		const mailOptions = {
			from: FROM_MAIL,
			subject,
		};
		mailOptions['to'] = recipient;
		// if (cc) {
		// 	mailOptions['cc'] = cc;
		// }
		if (bcc) {
			mailOptions['bcc'] = bcc;
		}
		if (template) {
			try {
				mailOptions['html'] = template;
			} catch (error) {
				return reject(error);
			}
		}
		if (html) {
			mailOptions['html'] = html;
		}
		return transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				// console.log(
				// 	'🚀 ~ file: mail.service.ts ~ line 79 ~ returntransporter.sendMail ~ err',
				// 	err
				// );
				reject(err);
			}
			resolve(true);
		});
	});
};
