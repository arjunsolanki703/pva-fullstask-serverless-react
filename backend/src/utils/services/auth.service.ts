import { JWT_SECRET, JWT_EXPIRE_IN } from '../../environments';
import * as bcryptjs from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import * as OTP from 'otp-generator';

export const otp = async (number = 4): Promise<string> => {
	return new Promise((resolve, reject) => {
		const otpNo = OTP.generate(number, {
			digits: true,
			alphabets: false,
			upperCase: false,
			specialChars: false,
		});
		resolve(otpNo);
	});
};

/**
 * A helper function which is used for encrption of string into hash
 * @param {string} password - Which is going to encryption.
 */
export const encryptPassword = async (password: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		bcryptjs.genSalt(10, (err, salt) => {
			bcryptjs.hash(password, salt, (err, hash) => {
				if (err) {
					reject(err);
				}
				resolve(hash);
			});
		});
	});
};

/**
 * A helper function which is used for comparing plain text password with hash password
 * @param {string} hash
 * @param {string} plainText
 * @returns {boolean} Returns true if plain text match with hash or else return false
 */
export const decryptPassword = async (
	hash: string,
	plainText: string
): Promise<boolean> => {
	return new Promise((resolve, reject) => {
		bcryptjs.compare(plainText, hash, (err, success) => {
			if (err) {
				reject(err);
			}
			if (success) {
				resolve(true);
			}
			resolve(false);
		});
	});
};

/**
 * A helper function which is used for comparing plain text password with hash password
 * @param {string} hash
 * @param {string} plainText
 * @returns {boolean} Returns true if plain text match with hash or else return false
 */
export const createToken = async (payload: object): Promise<string> => {
	return new Promise((resolve, _) => {
		resolve(sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN }));
	});
};
