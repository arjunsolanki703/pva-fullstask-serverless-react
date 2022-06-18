import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
	autoReleaseMdn,
	reactivateTellabotNumber,
	ServiceResponseInterface,
	tellbotAutoService,
	autoReadSms,
	longTermNumber,
	LTRReadSMS,
	ToggleLTR,
	tellabotNumber,
	activateLTRNumber,
	LTRnumberStatusCheck,
	LTRReleaseMdn
} from '../utils';
import { Model, mongo, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import {
	AutoServiceQueryDto,
	CreateServiceRequestDto,
	ReactivateTellabotNumberDto,
	ListTransactionDto,
	GetTransactionDto,
	GetUserHistoryByIDDto,
	ReactivateAutoServiceDto,
	CreateLTRDto,
	LTRAutoServiceDto,
	ReactivateLTRServiceDto,
	AutoRenewDto,
} from './dto/InputArgs';
import { TellabotServicesService } from './tellabot-services/tellabot-services.service';
import {
	TellabotTransaction,
	TellabotTransactionDocument,
} from './tellatbot-transaction.model';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as utc from 'dayjs/plugin/utc';
import {
	RecentWebsite,
	RecentWebsiteDocument,
} from './tellabot-recentwebsite.model';
import { UserHistoryValidationPipe } from './tellabot-api.validations';
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(utc)
@Injectable()
export class TellabotApiService {
	constructor(
		@InjectModel(TellabotTransaction.name)
		private tellabotTransactionModel: Model<TellabotTransactionDocument>,
		private tellabotService: TellabotServicesService,
		private userService: UsersService,
		@InjectModel(RecentWebsite.name)
		private recentWebsiteModel: Model<RecentWebsiteDocument>
	) { }

	async expirenumber(
		requestID: string,
		is_flag: boolean
	): Promise<ServiceResponseInterface> {
		try {
			const request = await this.tellabotTransactionModel.findOne({
				_id: requestID,
			});
			if (request.active === false) {
				return {
					status: HttpStatus.OK,
					message: 'already expired',
					success: false,
					data: {},
				};
			}
			if (request.is_ltr) {
				
				
				// else {
				const { status, message } = await LTRReleaseMdn(
					request.credit.services[request.credit.services.length - 1].message_id
				);
				if (status === 'error') {
					request.active = false;
					await this.tellabotTransactionModel.updateOne(
						{ _id: requestID },
						request
					);
					request.status = 'FLAGGED';
					request.active = false;
					var total = request.ltr_autorenew ? request.credit.totalCreditCharge + (request.credit.totalCreditCharge - (0.25 * request.credit.totalCreditCharge)) : request.credit.totalCreditCharge
					await this.tellabotTransactionModel.updateOne(
						{ _id: requestID },
						request
					);
					await this.userService.AddCredits(
						request.user_id,
						total
					);
					return {
						status: HttpStatus.OK,
						message: message,
						success: false,
						data: {},
					};
				}
				if (is_flag) {
					request.status = 'FLAGGED';
					request.active = false;
					var total = request.ltr_autorenew ? request.credit.totalCreditCharge + (request.credit.totalCreditCharge - (0.25 * request.credit.totalCreditCharge)) : request.credit.totalCreditCharge
					await this.tellabotTransactionModel.updateOne(
						{ _id: requestID },
						request
					);
					await this.userService.AddCredits(
						request.user_id,
						total
					);
				} else {
					request.active = false;
					request.status = 'COMPLETED';
					await this.tellabotTransactionModel.updateOne(
						{ _id: requestID },
						request
					);
				}
				if (request.ltr_autorenew) {				
					request.endtime = dayjs().add(30, 'day').toISOString();
					await this.tellabotTransactionModel.updateOne(
						{ _id: requestID },
						request
					);
					// await this.userService.AddCredits(
					// 	request.user_id,
					// 	(request.credit.totalCreditCharge + (0.25 * request.credit.totalCreditCharge))
					// );
				}
				// }
			} else {
				const { status, message } = await autoReleaseMdn(
					request.credit.services[request.credit.services.length - 1].message_id
				);
				if (status === 'error') {
					request.active = false;
					await this.tellabotTransactionModel.updateOne(
						{ _id: requestID },
						request
					);
					return {
						status: HttpStatus.OK,
						message: message,
						success: false,
						data: {},
					};
				}
				if (is_flag) {
					request.status = 'FLAGGED';
					request.active = false;
					await this.tellabotTransactionModel.updateOne(
						{ _id: requestID },
						request
					);
					await this.userService.AddCredits(
						request.user_id,
						request.credit.totalCreditCharge
					);
				} else if (request.is_charge_cut) {
					request.active = false;
					request.status = 'COMPLETED';
					await this.tellabotTransactionModel.updateOne(
						{ _id: requestID },
						request
					);
				} else {
					request.status = 'TIMEOUT';
					request.active = false;
					await this.tellabotTransactionModel.updateOne(
						{ _id: requestID },
						request
					);
					await this.userService.AddCredits(
						request.user_id,
						request.credit.totalCreditCharge
					);
				}
			}
			return {
				success: true,
				status: HttpStatus.OK,
				data: {},
				message: '',
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async getrecentwebsite(id: string) {
		try {
			let website: any = await this.recentWebsiteModel
				.find({ user_id: id })
				.limit(6)
				.sort([['updatedAt', -1]]);
			const { status, message } = await tellabotNumber();
			if (status === 'error') {
				return {
					success: false,
					status: HttpStatus.NOT_FOUND,
					message: 'Error in fetching available numbers',
					data: {},
				};
			} else {
				for (let index = 0; index < website.length; index++) {
					const isactive = await this.tellabotService.isserviceactive(
						website[index].name, website[index].is_ltr
					);
					website[index].is_active = isactive;
					for (let temp = 0; temp < message.length; temp++) {
						if (website[index].name === message[temp].name) {
							website[index]._doc = {
								...website[index]._doc,
								available: message[temp].available,
								ltr_available: message[temp].ltr_available,
							};
						}
					}
				}
				return {
					success: true,
					status: HttpStatus.OK,
					data: website,
					message: '',
				};
			}
		} catch (err) {
			throw new Error(err);
		}
	}

	async getuserhistorybyID(
		query: GetUserHistoryByIDDto,
		id: string
	): Promise<ServiceResponseInterface> {
		try {
			const search_data = query.search_data ? query.search_data : '';
			const limit = query.limit ? Number(query.limit) : 10;
			const page = query.page ? Number(query.page) : 1;
			const skip = limit * (page - 1);
			const order_by = query.order_by ? query.order_by : 'name';
			const order = query.order ? 1 : -1;
			let filter_data = [];
			if (query.filter_data === 'RESERVED') {
				filter_data.push('RESERVED');
			} else if (query.filter_data === 'TIMEOUT') {
				filter_data.push('TIMEOUT');
			} else if (query.filter_data === 'COMPLETED') {
				filter_data.push('COMPLETED');
			} else if (query.filter_data === 'OUT_OF_STOCK') {
				filter_data.push('OUT_OF_STOCK');
			} else if (query.filter_data === 'FLAGGED') {
				filter_data.push('FLAGGED');
			} else {
				filter_data.push('OUT_OF_STOCK', 'RESERVED', 'TIMEOUT', 'COMPLETED', 'FLAGGED');
			}
			const data = await this.tellabotTransactionModel
				.find({
					$and: [
						{ user_id: id },
						{
							$or: [
								{ user_name: { $regex: search_data, $options: 'i' } },
								{ user_email: { $regex: search_data, $options: 'i' } },
								{ served_by: { $regex: search_data, $options: 'i' } },
								{
									'credit.services.name': {
										$regex: search_data,
										$options: 'i',
									},
								},
								{
									'credit.services.custom_name': {
										$regex: search_data,
										$options: 'i',
									},
								},
								{ number: { $regex: search_data, $options: 'i' } },
							],
						},
						{ status: { $in: filter_data } },
					],
				})
				.sort([[order_by, order]])
				.skip(skip)
				.limit(limit);
			const totaltransaction =
				await this.tellabotTransactionModel.countDocuments({
					$and: [
						{ user_id: id },
						{
							$or: [
								{ user_name: { $regex: search_data, $options: 'i' } },
								{ user_email: { $regex: search_data, $options: 'i' } },
								{ served_by: { $regex: search_data, $options: 'i' } },
								{
									'credit.services.name': {
										$regex: search_data,
										$options: 'i',
									},
								},
								{ number: { $regex: search_data, $options: 'i' } },
							],
						},
						{ status: { $in: filter_data } },
					],
				});
			return {
				success: true,
				status: HttpStatus.OK,
				message: '',
				data: { data, totaltransaction },
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async gethistorybyID(
		query: GetTransactionDto
	): Promise<ServiceResponseInterface> {
		try {
			const search_data = query.search_data ? query.search_data : '';
			const limit = query.limit ? Number(query.limit) : 10;
			const page = query.page ? Number(query.page) : 1;
			const skip = limit * (page - 1);
			const order_by = query.order_by ? query.order_by : 'name';
			const order = query.order ? 1 : -1;
			let filter_data = [];
			if (query.filter_data === 'RESERVED') {
				filter_data.push('RESERVED');
			} else if (query.filter_data === 'TIMEOUT') {
				filter_data.push('TIMEOUT');
			} else if (query.filter_data === 'COMPLETED') {
				filter_data.push('COMPLETED');
			} else if (query.filter_data === 'OUT_OF_STOCK') {
				filter_data.push('OUT_OF_STOCK');
			} else {
				filter_data.push('OUT_OF_STOCK', 'RESERVED', 'TIMEOUT', 'COMPLETED',"FLAGGED");
			}
			const data = await this.tellabotTransactionModel
				.find({
					$and: [
						{ user_id: query.userid },
						{
							$or: [
								{ user_name: { $regex: search_data, $options: 'i' } },
								{ user_email: { $regex: search_data, $options: 'i' } },
								{ served_by: { $regex: search_data, $options: 'i' } },
								{ number: { $regex: search_data, $options: 'i' } },
								{
									'credit.services.name': {
										$regex: search_data,
										$options: 'i',
									},
								},
							],
						},
						{ status: { $in: filter_data } },
					],
				})
				.sort([[order_by, order]])
				.skip(skip)
				.limit(limit);

			const totaltransaction =
				await this.tellabotTransactionModel.countDocuments({
					$and: [
						{ user_id: query.userid },
						{
							$or: [
								{ user_name: { $regex: search_data, $options: 'i' } },
								{ user_email: { $regex: search_data, $options: 'i' } },
								{ served_by: { $regex: search_data, $options: 'i' } },
								{ number: { $regex: search_data, $options: 'i' } },
								{
									'credit.services.name': {
										$regex: search_data,
										$options: 'i',
									},
								},
							],
						},
						{ status: { $in: filter_data } },
					],
				});
			return {
				success: true,
				status: HttpStatus.OK,
				message: '',
				data: { data, totaltransaction },
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async getallhistory(
		query: ListTransactionDto
	): Promise<ServiceResponseInterface> {
		try {
			const search_data = query.search_data ? query.search_data : '';
			const limit = query.limit ? Number(query.limit) : 10;
			const page = query.page ? Number(query.page) : 1;
			const skip = limit * (page - 1);
			const order_by = query.order_by ? query.order_by : 'name';
			const order = query.order ? 1 : -1;
			let filter_data = [];
			if (query.filter_data === 'RESERVED') {
				filter_data.push('RESERVED');
			} else if (query.filter_data === 'TIMEOUT') {
				filter_data.push('TIMEOUT');
			} else if (query.filter_data === 'COMPLETED') {
				filter_data.push('COMPLETED');
			} else if (query.filter_data === 'OUT_OF_STOCK') {
				filter_data.push('OUT_OF_STOCK');
			} else if (query.filter_data === 'FLAGGED') {
				filter_data.push('FLAGGED');
			} else {
				filter_data.push('OUT_OF_STOCK', 'RESERVED', 'TIMEOUT', 'COMPLETED', 'FLAGGED');
			}

			const data = await this.tellabotTransactionModel
				.find({
					$or: [
						{ user_name: { $regex: search_data, $options: 'i' } },
						{ user_email: { $regex: search_data, $options: 'i' } },
						{ served_by: { $regex: search_data, $options: 'i' } },
						{ number: { $regex: search_data, $options: 'i' } },
						{ 'credit.services.name': { $regex: search_data, $options: 'i' } },
						{ 'credit.services.custom_name': { $regex: search_data, $options: 'i' } },
					],
					status: { $in: filter_data },
				})
				.sort([[order_by, order]])
				.skip(skip)
				.limit(limit);

			// const tempdata = [];
			// const finaldata = [];
			// var totaldoc = 0;
			// for (let index = 0; index < data.length; index++) {
			// 	for (let i = 0; i < data[index].credit.services.length; i++) {
			// 		tempdata.push(data[index].credit.services[i]);
			// 		totaldoc = totaldoc + 1;
			// 	}
			// }
			// for (let index = skip; index < skip + limit; index++) {
			// 	finaldata.push(tempdata[index]);
			// }
			const totaltransaction =
				await this.tellabotTransactionModel.countDocuments({
					$or: [
						{ user_name: { $regex: search_data, $options: 'i' } },
						{ user_email: { $regex: search_data, $options: 'i' } },
						{ served_by: { $regex: search_data, $options: 'i' } },
						{ number: { $regex: search_data, $options: 'i' } },
						{ 'credit.services.name': { $regex: search_data, $options: 'i' } },
					],
					status: { $in: filter_data },
				});
			return {
				success: true,
				status: HttpStatus.OK,
				message: '',
				data: {
					data: data,
					totalusers: totaltransaction,
				},
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async CreateServiceRequest(
		input: CreateServiceRequestDto,
		userId: string,
		useremail: string,
		username: string
	): Promise<ServiceResponseInterface> {
		const servicesCredits = await this.tellabotService.GetServiceCredits(
			input.serviceIds,
			input.is_ltr
		);

		const { credits, hold_credit } = await this.userService.GetUsersCreditById(
			userId
		);
		if (credits < servicesCredits.totalCreditCharge) {
			return {
				success: false,
				status: HttpStatus.NOT_ACCEPTABLE,
				data: {},
				message: 'INSUFFICIENT_BALANCE',
			};
		} else {
			input['credit'] = servicesCredits;
			input['old_credit'] = credits;
			input['status'] = 'INITIALIZE';
			input['user_id'] = userId;
			input['user_name'] = username;
			input['user_email'] = useremail;
			input['agent'] = 'tellabot';
			const request = await this.tellabotTransactionModel.create(input);
			const isactive = await this.tellabotService.isserviceactive(
				request.credit.services[0].name, input.is_ltr
			);
			await this.recentWebsiteModel.findOneAndUpdate(
				{
					user_email: useremail,
					service_id: request.credit.services[0].service_id,
					is_ltr: input.is_ltr,
				},
				{
					is_active: isactive,
					credit: servicesCredits.totalCreditCharge,
					user_id: userId,
					name: request.credit.services[0].name,
					custom_name: request.credit.services[0].custom_name
				},
				{ upsert: true }
			);
			return {
				data: request,
				success: true,
				status: HttpStatus.OK,
				message: 'SERVICE_REQUEST_CREATED',
			};
		}
	}

	async LTRAutoService(
		input: LTRAutoServiceDto
	): Promise<ServiceResponseInterface> {
		const data = await this.tellabotTransactionModel.findById(input.requestId);
		const { status, message } = await longTermNumber(
			data.credit.services[0].name
		);

		if (status === 'error') {
			const request = await this.tellabotTransactionModel.findOneAndUpdate(
				{ _id: input.requestId },
				{ status: 'OUT_OF_STOCK' }
			);
			return {
				status: HttpStatus.OK,
				message: 'PLEASE_MAKE_REQUEST_AFTER_5_SEC',
				success: false,
				data: {},
			};
		} else {
			const request = await this.tellabotTransactionModel.findById(
				input.requestId
			);
			request.credit.services[0].message_id = message.id;
			request.number = message.mdn;
			request.active = true;
			request.endtime = dayjs().add(30, 'day').toISOString();
			request.status = 'RESERVED';
			request.is_charge_cut = true;
			await this.tellabotTransactionModel.updateOne(
				{ _id: input.requestId },
				request
			);
			await this.userService.AddCredits(
				request.user_id,
				-request.credit.totalCreditCharge
			);
		}
		return {
			status: HttpStatus.OK,
			message: '',
			success: true,
			data: {},
		};
	}

	async LTRReamSMS(
		mdn: string,
		serviceName: string,
		requestId: string
	): Promise<ServiceResponseInterface> {
		const request = await this.tellabotTransactionModel.findOne({
			_id: requestId,
		});
		const { status, message } = await LTRReadSMS(mdn, serviceName);

		if (status === 'error') {
			return {
				status: HttpStatus.OK,
				message: '',
				success: true,
				data: message,
			};
		} else {
			for (let index = 0; index < message.length; index++) {
				const tempdata: any = {
					message_id:request.credit.services[0].message_id,
					service_id: request.credit.services[0].service_id,
					name: request.credit.services[0].name,
					custom_name: request.credit.services[0].custom_name,
					credit: request.credit.services[0].credit,
					enable: request.credit.services[0].enable,
					is_price_surge: request.credit.services[0].is_price_surge,
					price_after_surge: request.credit.services[0].price_after_surge,
					ltr_price: request.credit.services[0].ltr_price,
					pin: message[index].pin,
					timestamp: message[index].timestamp,
					to: message[index].to,
					from: message[index].from,
					reply: message[index].reply,
					date_time: message[index].date_time,
				};
				request.credit.services[index] = tempdata;
				await this.tellabotTransactionModel.updateOne(
					{ _id: requestId },
					request
				);
			}
			return {
				status: HttpStatus.OK,
				message: 'REQUEST_EXECUTED',
				success: true,
				data: message,
			};
		}
	}

	async ToggleAutoRenewLTR(
		input: AutoRenewDto
	): Promise<ServiceResponseInterface> {
		const request = await this.tellabotTransactionModel.findOne({
			_id: input.requestId,
		});
		if (!request) {
			return {
				status: HttpStatus.BAD_REQUEST,
				message: '',
				success: false,
				data: 'This request does not exist',
			};
		}

		const { credits, hold_credit } = await this.userService.GetUsersCreditById(
			request.user_id
		);
		// Check if same request is done multiple times
		if (request.ltr_autorenew === input.autoRenew) {
			return {
				status: HttpStatus.OK,
				message: '',
				success: true,
				data: 'Auto renew status stayed the same',
			};
		}
		// Checking if user has enough credits to ON auto-renew
		if (credits < request.credit.totalCreditCharge) {
			return {
				success: false,
				status: HttpStatus.NOT_ACCEPTABLE,
				data: {},
				message: 'INSUFFICIENT_BALANCE',
			};
		}

		// Toggling the auto-renew status
		const { status, message } = await ToggleLTR(
			request.credit.services[0].name,
			input.mdn,
			input.autoRenew
		);
		if (status === 'error') {
			return {
				status: HttpStatus.OK,
				message: '',
				success: false,
				data: message,
			};
		}

		// updating status in DB
		await this.tellabotTransactionModel.findOneAndUpdate(
			{ _id: input.requestId },
			{ ltr_autorenew: input.autoRenew }
		);

		if (input.autoRenew) {
			// removing credits
			var newtotal = (request.credit.totalCreditCharge - (0.25 * request.credit.totalCreditCharge));   
			await this.userService.AddCredits(request.user_id,-newtotal);
			return {
				status: HttpStatus.OK,
				message: '',
				success: true,
				data: {
					data: message,
					status: request.status,
					serviceName: request.credit.services[0].name,
					number: request.number,
					creditsUpdate: -newtotal,
				},
			};
		} else {
			// addding credits
			var newtotal = (request.credit.totalCreditCharge - (0.25 * request.credit.totalCreditCharge));
			await this.userService.AddCredits(
				request.user_id,
				newtotal
			);
			return {
				status: HttpStatus.OK,
				message: '',
				success: true,
				data: {
					data: message,
					status: request.status,
					serviceName: request.credit.services[0].name,
					number: request.number,
					creditsUpdate: -request.credit.totalCreditCharge,
				},
			};
		}
	}

	async ReactivateAutoService(
		input: ReactivateAutoServiceDto
	): Promise<ServiceResponseInterface> {
		const serviceCredits = await this.tellabotService.GetServiceCredits(
			input.serviceId,
			false
		);
		const request = await this.tellabotTransactionModel.findOne({
			_id: input.requestId,
		});
		const { status, message } = await reactivateTellabotNumber(
			request.credit.services[0].name,
			request.number
		);
		if (status === 'error') {
			return {
				status: HttpStatus.OK,
				message: '',
				success: false,
				data: message,
			};
		} else {
			const request = await this.tellabotTransactionModel.findOne({
				_id: input.requestId,
			});
			const index = request.credit.services.length;
			request.credit.services[index] = serviceCredits.services[0];
			await this.tellabotTransactionModel.updateOne(
				{ _id: input.requestId },
				request
			);
			request.credit.services[index].message_id = message[0].id;
			await this.tellabotTransactionModel.updateOne(
				{ _id: input.requestId },
				request
			);
			return {
				status: HttpStatus.OK,
				message: 'REQUEST_EXECUTED',
				success: true,
				data: request,
			};
		}
	}

	async ReactivateTellabotNumber(
		input: ReactivateTellabotNumberDto,
		userId: string,
		useremail: string,
		username: string
	): Promise<ServiceResponseInterface> {
		const obj: CreateServiceRequestDto = {
			serviceIds: [input.serviceId],
			is_reactivate: true,
			number: input.mdn,
			is_ltr: false,
		};
		const createservice = await this.CreateServiceRequest(
			obj,
			userId,
			useremail,
			username
		);
		if (createservice.success) {
			const { status, message } = await reactivateTellabotNumber(
				createservice.data.credit.services[0].name,
				input.mdn
			);
			if (status === 'error') {
				const request = await this.tellabotTransactionModel.findOneAndUpdate(
					{ _id: createservice.data._id },
					{ status: 'OUT_OF_STOCK' }
				);
				return {
					status: HttpStatus.OK,
					message: '',
					success: false,
					data: { data: createservice.data, message: message },
				};
			} else {
				const request = await this.tellabotTransactionModel.findOne({
					_id: createservice.data._id,
				});
				request.credit.services[0].message_id = message[0].id;
				request.active = true;
				request.status = 'RESERVED';
				const now = dayjs();
				const endtime = now.add(15, 'm').toISOString();
				request.endtime = endtime;
				await this.tellabotTransactionModel.updateOne(
					{ _id: createservice.data._id },
					request
				);
				await this.tellabotTransactionModel.updateOne(
					{ _id: createservice.data._id },
					{ number: message[0].mdn }
				);
				await this.userService.AddCredits(
					request.user_id,
					-request.credit.totalCreditCharge
				);
				return {
					status: HttpStatus.OK,
					message: 'REQUEST_EXECUTED',
					success: true,
					data: { data: createservice, message: message },
				};
			}
		}
		return {
			success: false,
			status: HttpStatus.OK,
			data: createservice.data,
			message: createservice.message,
		};
	}

	async AutoReleaseMdn(id: string): Promise<ServiceResponseInterface> {
		const { status, message, data } = await autoReleaseMdn(id);

		if (status === 'error') {
			return {
				status: HttpStatus.OK,
				message: message,
				success: false,
				data: {},
			};
		} else {
			return {
				status: HttpStatus.OK,
				message: 'MDN_RELEASE_SUCCESSFULLY',
				success: true,
				data: data,
			};
		}
	}

	async AutoService(requestId: string, input: any): Promise<ServiceResponseInterface> {
		const data = await this.tellabotTransactionModel.findById(requestId);
		const serviceName = [];
		await asyncForEach(data.credit.services, function (item) {
			serviceName.push(item.name);
		});
		const { status, message } = await tellbotAutoService(serviceName, input.short_name);
		if (status === 'error') {
			const data = await this.tellabotTransactionModel.findOne({
				_id: requestId,
			});
			const request = await this.tellabotTransactionModel.findOneAndUpdate(
				{ _id: requestId, 'credit.services.service_id': data.credit.services[0].service_id },
				{ status: 'OUT_OF_STOCK', "credit.services.$.state": input.short_name }
			);
			return {
				status: HttpStatus.OK,
				message: 'PLEASE_MAKE_REQUEST_AFTER_5_SEC',
				success: false,
				data: message
			};
		} else {
			const request = await this.tellabotTransactionModel.findOne({
				_id: requestId,
			});
			const now = dayjs();
			// console.log(now.format('YYYY-MM-DD HH:mm:ss'));
			const endtime = now.add(15, 'm').toISOString();
			request.endtime = endtime;
			for (let index = 0; index < message.length; index++) {
				request.credit.services[index].message_id = message[index].id;
				request.credit.services[index].state = message[index].state;
				request.active = true;
				request.status = 'RESERVED';
				await this.tellabotTransactionModel.updateOne(
					{ _id: requestId },
					request
				);
			}
			await this.userService.AddCredits(
				request.user_id,
				-request.credit.totalCreditCharge
			);
			await this.tellabotTransactionModel.updateOne(
				{ _id: requestId },
				{ number: message[0].mdn }
			);
			return {
				status: HttpStatus.OK,
				message: 'REQUEST_EXECUTED',
				success: true,
				data: message,
			};
		}
	}

	async AutoSmsRead(
		mdn: string,
		serviceName: string,
		requestId: string,
		messageId: string
	): Promise<ServiceResponseInterface> {
		const { status, message } = await autoReadSms(mdn, serviceName, messageId);

		if (status === 'error') {
			return {
				status: HttpStatus.OK,
				message: message,
				success: true,
				data: {},
			};
		} else {
			const request = await this.tellabotTransactionModel.findOne({
				_id: requestId,
			});
			const serviceValue = request.credit.services.findIndex(
				(o) => o.message_id == messageId
			);
			request.credit.services[serviceValue]['pin'] = message[0].pin;
			request.credit.services[serviceValue]['timestamp'] = message[0].timestamp;
			request.credit.services[serviceValue]['date_time'] = message[0].date_time;
			request.credit.services[serviceValue]['from'] = message[0].from;
			request.credit.services[serviceValue]['to'] = message[0].to;
			request.credit.services[serviceValue]['reply'] = message[0].reply;
			if (!request.is_charge_cut) {
				request.is_charge_cut = true;
			}
			await this.tellabotTransactionModel.updateOne(
				{ _id: requestId },
				request
			);
			return {
				status: HttpStatus.OK,
				message: 'SMS_RECEIVED_SUCCESSFULLY',
				success: true,
				data: message,
			};
		}
	}

	async activenumber(userid: string): Promise<ServiceResponseInterface> {
		try {
			let numbers = [];
			const data = await this.tellabotTransactionModel.find({
				user_id: userid,
			});
			for (let index = 0; index < data.length; index++) {
				if (data[index].active) {
					numbers.push(data[index]);
				}
			}
			// await asyncForEach(data, async function (item) {
			// 	await asyncForEach(item.credit.services, async function (service) {
			// 		if (service.active) {
			// 			numbers.push({
			// 				requestid: item._id,
			// 				data: service,
			// 				number: item.number,
			// 				status: item.status,
			// 				endtime: item.endtime,
			// 			});
			// 		}
			// 	});
			// });
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'ACTIVE_NUMBER_LIST',
				data: numbers,
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async getNumberData(
		userid: string,
		requestId: string
	): Promise<ServiceResponseInterface> {
		try {
			const data = await this.tellabotTransactionModel.findOne({
				user_id: userid,
				active: true,
				_id: new mongo.ObjectID(requestId),
			});
			return {
				success: true,
				status: HttpStatus.OK,
				message: 'ACTIVE_NUMBER_DATA',
				data: data,
			};
		} catch (err) {
			throw new Error(err);
		}
	}

	async verifyUserBlockStatus(userId: string, requestId: CreateServiceRequestDto) {
		const now = dayjs();
		const data = await this.tellabotTransactionModel.find({ user_email: userId, status: { $in: ["TIMEOUT", "RESERVED"] }, "credit.services.service_id": new Types.ObjectId(requestId.serviceIds[0]), is_ltr: false, $and: [{ createdAt: { $gte: now.subtract(60, 'minute').utc().toDate() } }, { createdAt: { $lte: now.utc().toDate() } }] });
		if (data.length >= 3 && !requestId.is_ltr) {
			return {
				status: HttpStatus.NOT_ACCEPTABLE,
				message: 'USER_BLOCKED_FOR_1_HOUR',
				success: false,
				data: { isBlocked: true, endTime: now.add(1, 'hour').toISOString(), serviceId: requestId.serviceIds[0] },
			};
		} else {
			return {
				data: data,
				success: true,
				status: HttpStatus.OK,
				message: 'VERIFY_SUCCESSFULLY',
			};
		}
	}

	async activateLTRnumber(input: any): Promise<ServiceResponseInterface> {
		const { status, message } = await activateLTRNumber(
			input.mdn
		);
		if (status === 'error') {
			return {
				status: HttpStatus.OK,
				message: '',
				success: false,
				data: message,
			};
		} else {
			const data = await this.tellabotTransactionModel.updateOne({ _id: input.requestId }, { $set: { LTRNumberStatus: message.ltr_status, LTRActiveTime: message.till_change, LTRActiveTimeDate: dayjs().add(message.till_change, 'seconds').toISOString() } })
			return {
				status: HttpStatus.OK,
				message: '',
				success: true,
				data: message,
			};
		}
	}

	async LTRnumberStatusCheck(input: any): Promise<ServiceResponseInterface> {
		const { status, message } = await LTRnumberStatusCheck(
			input.mdn
		);
		if (status === 'error') {
			return {
				status: HttpStatus.NOT_ACCEPTABLE,
				message: '',
				success: false,
				data: {},
			};
		} else {
			const data = await this.tellabotTransactionModel.updateOne({ _id: input.requestId }, { $set: { LTRNumberStatus: message.ltr_status, LTRActiveTime: message.till_change, LTRActiveTimeDate: dayjs().add(message.till_change, 'seconds').toISOString() } })
			return {
				status: HttpStatus.OK,
				message: '',
				success: true,
				data: message,
			};
		}
	}
}

const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};
