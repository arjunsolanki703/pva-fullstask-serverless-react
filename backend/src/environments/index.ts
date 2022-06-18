import { join } from 'path';

const NODE_ENV: string = process.env.APP_ENV || 'development';

const __PROD__: boolean = NODE_ENV === 'development' ? false : true;

// APPLICATION CONFIG
const PORT: number = 8081 || +process.env.PORT;
const APP_URL: string = process.env.APP_URL;

const MONGO_URI: string = process.env.MONGO_URI;

const JWT_SECRET: string = process.env.JWT_SECRET;
const JWT_EXPIRE_IN: string = process.env.JWT_EXPIRE_IN;

const DEFAULT_LANGUAGE: string = process.env.DEFAULT_LANGUAGE || 'en';

const MAILING_SERVICE: string = process.env.MAILING_SERVICE;
const MAILING_USERNAME: string = process.env.MAILING_USERNAME;
const FROM_MAIL: string = process.env.FROM_MAIL;
const MAILING_PASSWORD: string = process.env.MAILING_PASSWORD;

const SES_REGION: string = process.env.SES_REGION;
const IAM_USER_ACCESS_KEY_ID: string = process.env.IAM_USER_ACCESS_KEY_ID;
const IAM_USER_SECRET_KEY: string = process.env.IAM_USER_SECRET_KEY;

const TELLABOT_USERNAME: string = process.env.TELLABOT_USERNAME;
const TELLABOT_PASSWORD: string = process.env.TELLABOT_PASSWORD;

const SENTRY_DSN: string = process.env.SENTRY_DSN;

const COINPAYMENT_KEY: string = process.env.COINPAYMENT_KEY;
const CAPTCHA_SECRET_KEY: string = process.env.CAPTCHA_SECRET_KEY;
const COINPAYMENT_SECRET: string = process.env.COINPAYMENT_SECRET;
const COINPAYMENT_MERCHANT_ID: string = process.env.COINPAYMENT_MERCHANT_ID;
const COINPAYMENT_IPN_SECRET: string = process.env.COINPAYMENT_IPN_SECRET;
const COINPAYMENT_IPN_URL: string = process.env.COINPAYMENT_IPN_URL;
const PAYMENT_TRANSACTION_MAIL: string = process.env.PAYMENT_TRANSACTION_MAIL;

const REDIS_HOST: string = process.env.REDIS_HOST;
const REDIS_PORT: number = +process.env.REDIS_PORT;
const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD;

const LOGGING: string = process.env.LOGGING || 'false';

export {
	NODE_ENV,
	__PROD__,
	PORT,
	APP_URL,
	MONGO_URI,
	JWT_SECRET,
	JWT_EXPIRE_IN,
	DEFAULT_LANGUAGE,
	MAILING_SERVICE,
	MAILING_USERNAME,
	FROM_MAIL,
	MAILING_PASSWORD,
	SES_REGION,
	IAM_USER_ACCESS_KEY_ID,
	IAM_USER_SECRET_KEY,
	TELLABOT_USERNAME,
	TELLABOT_PASSWORD,
	SENTRY_DSN,
	COINPAYMENT_KEY,
	COINPAYMENT_SECRET,
	COINPAYMENT_MERCHANT_ID,
	COINPAYMENT_IPN_SECRET,
	COINPAYMENT_IPN_URL,
	PAYMENT_TRANSACTION_MAIL,
	CAPTCHA_SECRET_KEY,
	REDIS_HOST,
	REDIS_PORT,
	REDIS_PASSWORD,
	LOGGING,
};
