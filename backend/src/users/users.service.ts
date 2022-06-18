import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	SignInDto,
	SignUpDto,
	ResetPasswordDto,
	ResetPasswordEmailDto,
	VerifyOtpDto,
	AdminCustomerVerification,
} from '../auth/dto/InputArgs';
import { Model } from 'mongoose';
import {
	encryptPassword,
	getDataFromCacheByKey,
	sendEmail,
	ServiceResponseInterface,
	setDataTOCache,
	otp,
	deleteDataFromCache,
	createToken,
	decryptPassword,
} from '../utils';
import {
	CreateUserDto,
	ListCustomerDto,
	AddorUpdateCustomerDto,
} from './dto/InputArgs';
import { User, UserDocument } from './users.model';
import { APP_URL, MAILING_USERNAME } from '../environments';
import * as uniqid from 'uniqid';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }
	async SampleRoute(input: CreateUserDto): Promise<ServiceResponseInterface> {
		return {
			data: input,
			message: 'DEMO',
			status: HttpStatus.OK,
			success: true,
		};
	}

	async userprofile(id: string): Promise<ServiceResponseInterface> {
		try {
			const data = await this.userModel.findById(id);
			return {
				success: true,
				status: HttpStatus.OK,
				message: '',
				data: data,
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async readNews(id: string): Promise<Boolean> {
		try {
			await this.userModel.findByIdAndUpdate(
				{ _id: id },
				{ $set: { unreaded_news: false } }
			);
			return true;
		} catch (error) {
			throw new Error(error);
		}
	}

	async addNews(): Promise<Boolean> {
		try {
			await this.userModel.updateMany({}, { $set: { unreaded_news: true } });
			return true;
		} catch (err) {
			throw new Error(err);
		}
	}
	async addcredits(useremail: string, credit: number): Promise<Boolean> {
		try {
			const addcredit = await this.userModel.findOneAndUpdate(
				{ email: useremail },
				{ $inc: { credits: credit } }
			);
			return true;
		} catch (err) {
			throw new Error(err);
		}
	}

	async resetpasswordemail(
		input: ResetPasswordEmailDto
	): Promise<ServiceResponseInterface> {
		try {
			// const user = await this.userModel.findOne({ email: input.email });
			const user = await this.userModel.find({"email":{ $regex: new RegExp(`^${input.email}$`, "i") } });
			if (!user || user.length == 0) {
				return {
					success: false,
					status: HttpStatus.NOT_FOUND,
					message: 'USER_DOES_NOT_EXIST',
					data: {},
				};
			}
			const otpexist = await getDataFromCacheByKey(`USER_${input.email}_OTP`);
			if (otpexist) {
				return {
					success: false,
					status: HttpStatus.REQUEST_TIMEOUT,
					message: 'REQUEST_OTP_AFTER_5_MIN',
					data: {},
				};
			}
			const newotp = await otp();
			await setDataTOCache(`USER_${input.email}_OTP`, newotp, 300);
			await sendEmail(
				[input.email],
				`Reset Password`,
				MAILING_USERNAME,
				'',
				'',
				`<div style="font-family: arial">
				<p style="font-size: 18px">
					We have received your request to reset password on your account.
				</p>
				<p style="font-size: 18px">
					The OTP to reset your password is <b>${newotp}</b>
				</p>
				<p style="font-size: 18px">Thank You,</p>
				<p style="font-size: 18px">serverlessadeals Team.</p>
			</div>`
			);
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'EMAIL_SENT_SUCCESSFULLY',
				data: {},
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async verifyotp(input: VerifyOtpDto): Promise<ServiceResponseInterface> {
		try {
			const validotp = await getDataFromCacheByKey(`USER_${input.email}_OTP`);
			if (validotp == input.code) {
				return {
					success: true,
					status: HttpStatus.OK,
					message: 'OTP_VERIFIED_SUCCESSFULLY',
					data: {},
				};
			}
			return {
				success: false,
				status: HttpStatus.FORBIDDEN,
				message: 'WRONG_OTP',
				data: {},
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async resetpassword(
		input: ResetPasswordDto
	): Promise<ServiceResponseInterface> {
		try {
			const newpassword = await encryptPassword(input.new_password);
			const user = await this.userModel.findOneAndUpdate(
				{ email: input.email },
				{ password: newpassword }
			);
			if (user) {
				await deleteDataFromCache(`USER_${input.email}_OTP`);
				return {
					success: true,
					status: HttpStatus.OK,
					message: 'PASSWORD_CHANGED_SUCCESSFULLY',
					data: {},
				};
			}
			return {
				success: false,
				status: HttpStatus.NOT_FOUND,
				message: 'USER_DOES_NOT_EXIST',
				data: {},
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async AddorUpdateCustomer(
		input: AddorUpdateCustomerDto
	): Promise<ServiceResponseInterface> {
		try {
			if (input.id) {
				const service = await this.userModel.findOneAndUpdate(
					{ _id: input.id },
					input
				);
				return {
					success: true,
					status: HttpStatus.OK,
					message: 'USER_UPDATED_SUCCESSFULLY',
					data: {},
				};
			} else {
				const session = await this.userModel.startSession();
				session.startTransaction();
				try {
					const newAdminService = await this.userModel.create(input);
					const token = uniqid('verify_');
					await setDataTOCache(token, newAdminService._id);
					const name = input.name;
					const VERIFY_URL = APP_URL + `verify-account/${token}`;
					await sendEmail(
						[input.email],
						`${input.name}, Confirm Registration With serverlessadeals`,
						MAILING_USERNAME,
						'',
						'',
						`<div style="font-family: arial">
						<p style="font-size: 20px">Hi ${name},</p>
						<p style="font-size: 18px">
							We have received your request to register your account on
							<a style="color: #13203c" href="${APP_URL}">app.serverlessadeals.com</a>
						</p>
						<p style="font-size: 18px">
							Please click below to verify your email account.
						</p>
						<a style="color: #ffffff; font-size: 18px" href="${VERIFY_URL}">
							<button
								style="
									background-color: #143066;
									border-radius: 6px;
									color: #ffffff;
									font-size: 16px;
									padding: 5px;
								"
							>
								Confirm Email
							</button>
						</a>
						<p style="font-size: 18px">Thank You,</p>
						<p style="font-size: 18px">serverlessadeals Team.</p>
					</div>
					`
					);
					await session.commitTransaction();
					return {
						success: true,
						status: HttpStatus.OK,
						message: 'USER_CREATED_SUCCESSFULLY',
						data: {},
					};
				} catch (er) {
					await session.abortTransaction();
					throw new Error(er);
				}
			}
		} catch (err) {
			throw new Error(err);
		}
	}

	async DeleteCustomer(id: string): Promise<boolean> {
		try {
			const service = await this.userModel.findByIdAndDelete(id);
			return true;
		} catch (err) {
			throw new Error(err);
		}
	}

	async GetAllCustomers(
		query: ListCustomerDto
	): Promise<ServiceResponseInterface> {
		try {
			const search_data = query.search_data ? query.search_data : '';
			const limit = query.limit ? Number(query.limit) : 10;
			const page = query.page ? Number(query.page) : 1;
			const skip = limit * (page - 1);
			const order_by = query.order_by ? query.order_by : 'name';
			const order = query.order ? 1 : -1;
			const data = await this.userModel
				.find({
					$and: [
						{ user_type: 'client' },
						{
							$or: [
								{ name: { $regex: search_data, $options: 'i' } },
								{ email: { $regex: search_data, $options: 'i' } },
								{ country: { $regex: search_data, $options: 'i' } },
								{ contact: { $regex: search_data, $options: 'i' } },
								{ skype: { $regex: search_data, $options: 'i' } },
								{ status: { $regex: search_data, $options: 'i' } },
							],
						},
					],
				})
				.sort([[order_by, order]])
				.skip(skip)
				.limit(limit);

			const totalusers = await this.userModel.countDocuments({
				$and: [
					{ user_type: 'client' },
					{
						$or: [
							{ name: { $regex: search_data, $options: 'i' } },
							{ email: { $regex: search_data, $options: 'i' } },
							{ country: { $regex: search_data, $options: 'i' } },
							{ contact: { $regex: search_data, $options: 'i' } },
							{ skype: { $regex: search_data, $options: 'i' } },
							{ status: { $regex: search_data, $options: 'i' } },
						],
					},
				],
			});
			return {
				success: true,
				status: HttpStatus.OK,
				message: '',
				data: { data: data, totalusers: totalusers },
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async GetUserCount(): Promise<number> {
		const users = await this.userModel.countDocuments();
		return users;
	}

	async SignIn(input: SignInDto): Promise<ServiceResponseInterface> {
		const user = await this.userModel.findOne({ email: input.email });
		if (
			user &&
			user.password &&
			(await decryptPassword(user.password, input.password))
		) {
			if (!user.active) {
				return {
					success: false,
					message: 'Your account is disabled',
					status: HttpStatus.UNAUTHORIZED,
					data: {},
				};
			}

			if (user.status === 'notverified') {
				return {
					success: false,
					message: 'USER_ACCOUNT_IS_NOT_VERIFIED',
					status: HttpStatus.UNAUTHORIZED,
					data: {},
				};
			}
			const token = await createToken({
				id: user._id,
				email: user.email,
				name: user.name,
				type: user.user_type,
				credit: user.credits,
			});
			await this.userModel.findByIdAndUpdate(
				{ _id: user._id },
				{ last_login: new Date() }
			);
			return {
				success: true,
				data: { token: token, usertype: user.user_type },
				message: 'USER_LOGIN_SUCCESSFULLY',
				status: HttpStatus.OK,
			};
		} else {
			return {
				success: false,
				status: HttpStatus.NOT_FOUND,
				message: 'INVALID_EMAIL_OR_PASSWORD',
				data: {},
			};
		}
	}

	async SignUp(input: SignUpDto): Promise<ServiceResponseInterface> {
		const isUserExist = await this.userModel.findOne({ email: input.email.toLowerCase() });
		if (isUserExist) {
			if (isUserExist.status === "notverified") {
				const token = uniqid('verify_');
				const name = input.name;
				const VERIFY_URL = APP_URL + `verify-account/${token}`;
				await sendEmail(
					[input.email],
					`${input.name}, Confirm Registration With serverlessadeals`,
					MAILING_USERNAME,
					'',
					'',
					`<div style="font-family: arial">
								<p style="font-size: 20px">Hi ${name},</p>
								<p style="font-size: 18px">
									We have received your request to register your account on
									<a style="color: #13203c" href="${APP_URL}">app.serverlessadeals.com</a>
								</p>
								<p style="font-size: 18px">
									Please click below to verify your email account.
								</p>
								<a style="color: #ffffff; font-size: 18px" href="${VERIFY_URL}">
									<button
										style="
											background-color: #143066;
											border-radius: 6px;
											color: #ffffff;
											font-size: 16px;
											padding: 5px;
										"
									>
										Confirm Email
									</button>
								</a>
								<p style="font-size: 18px">Thank You,</p>
								<p style="font-size: 18px">serverlessadeals Team.</p>
							</div>
							`
				);
				return {
					status: HttpStatus.OK,
					success: true,
					message: 'USER_ACCOUNT_RE_SEND_EMAIL_SUCCESSFULLY',
					data: {},
				};
			} else {
				return {
					success: false,
					status: HttpStatus.NOT_ACCEPTABLE,
					// message: 'USER_WITH_SAME_EMAIL_ALREADY_EXIST',
					message: 'Email is already registere',
					data: {},
				};
			}
		}
		input['password'] = await encryptPassword(input['password']);
		input['status'] = 'notverified';
		input['user_type'] = 'client';
		const session = await this.userModel.startSession();
		session.startTransaction();
		try {
			const newUser = await this.userModel.create(input);
			const token = uniqid('verify_');
			await setDataTOCache(token, newUser._id);
			const name = input.name;
			const VERIFY_URL = APP_URL + `verify-account/${token}`;
			await sendEmail(
				[input.email],
				`${input.name}, Confirm Registration With serverlessadeals`,
				MAILING_USERNAME,
				'',
				'',
				`<div style="font-family: arial">
						<p style="font-size: 20px">Hi ${name},</p>
						<p style="font-size: 18px">
							We have received your request to register your account on
							<a style="color: #13203c" href="${APP_URL}">app.serverlessadeals.com</a>
						</p>
						<p style="font-size: 18px">
							Please click below to verify your email account.
						</p>
						<a style="color: #ffffff; font-size: 18px" href="${VERIFY_URL}">
							<button
								style="
									background-color: #143066;
									border-radius: 6px;
									color: #ffffff;
									font-size: 16px;
									padding: 5px;
								"
							>
								Confirm Email
							</button>
						</a>
						<p style="font-size: 18px">Thank You,</p>
						<p style="font-size: 18px">serverlessadeals Team.</p>
					</div>
					`
			);
			await session.commitTransaction();
			return {
				status: HttpStatus.OK,
				success: true,
				message: 'USER_ACCOUNT_CREATED_SUCCESSFULLY',
				data: {},
			};
		} catch (error) {
			// console.debug('===============', error);
			await session.abortTransaction();
			throw new Error(error);
		}
	}

	async admincustomerverify(
		input: AdminCustomerVerification
	): Promise<ServiceResponseInterface> {
		try {
			const isVerificationTokenExist = await getDataFromCacheByKey(input.code);
			if (!isVerificationTokenExist) {
				return {
					status: HttpStatus.UNAUTHORIZED,
					success: false,
					message: 'INVALID_VERIFICATION_TOKEN',
					data: {},
				};
			}
			const userpassword = await encryptPassword(input.password);
			const user = await this.userModel.findOneAndUpdate(
				{
					_id: isVerificationTokenExist,
				},
				{ status: 'verified', password: userpassword }
			);
			return {
				success: true,
				data: {},
				message: 'USER_VERIFICATION_SUCCESSFULLY',
				status: HttpStatus.OK,
			};
		} catch (err) {
			// console.log(err);
			throw new Error(err);
		}
	}

	async VerifyAccount(
		verificationCode: string
	): Promise<ServiceResponseInterface> {
		const isVerificationTokenExist = await getDataFromCacheByKey(
			verificationCode
		);
		if (!isVerificationTokenExist) {
			return {
				status: HttpStatus.UNAUTHORIZED,
				success: false,
				message: 'INVALID_VERIFICATION_TOKEN',
				data: {},
			};
		}
		const user = await this.userModel.findOneAndUpdate(
			{ _id: isVerificationTokenExist },
			{ status: 'verified' }
		);
		const token = await createToken({
			id: user._id,
			email: user.email,
			name: user.name,
		});
		return {
			success: true,
			data: { token },
			message: 'USER_VERIFICATION_SUCCESSFULLY',
			status: HttpStatus.OK,
		};
	}

	async GetUsersCreditById(id: string): Promise<UserDocument> {
		const user = await this.userModel.findOne({ _id: id });
		return user;
	}

	async AddAmtToHold(
		id: string,
		holdAmt: number,
		creditAmt: number = 0
	): Promise<boolean> {
		await this.userModel.updateOne(
			{ _id: id },
			{ $inc: { hold_credit: holdAmt, credits: creditAmt } }
		);
		return true;
	}
	async AddCredits(id: string, creditAmt: number): Promise<boolean> {
		await this.userModel.updateOne(
			{ _id: id },
			{ $inc: { credits: creditAmt } }
		);
		return true;
	}

	async CheckUserStatus(id: string) {
		const data = await this.userModel.findById(id)
		return data;
	}
}
